import Bluebird from 'bluebird';
import { promises as fs } from 'fs';
import * as path from 'path';
import setup from '../../../server/server';
import { Application } from '@feathersjs/express';
import { MethodNotAllowed, BadRequest } from '../../../common/errors';
import { Service } from '@feathersjs/feathers';
import { User } from '@sradevski/la-sdk/dist/models/user';
import { getExternalUserParams } from '../../../../tests/utils';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import fixtures from '../../../../tests/fixtures';
import { OrderPayments } from '@sradevski/la-sdk/dist/models/orderPayments';
import { sdk } from '@sradevski/la-sdk';
import { Delivery } from '@sradevski/la-sdk/dist/models/delivery';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { Order } from '@sradevski/la-sdk/dist/models/order';
import { Address } from '@sradevski/la-sdk/dist/models/address/address';
import * as nestpay from '../nestpay';

const getFixturesContent = async (folderName: string) => {
  const folderPath = path.resolve(__dirname, folderName);
  return await fs.readdir(folderPath).then(files =>
    Bluebird.map(files, file => {
      return fs
        .readFile(path.resolve(folderPath, file), 'utf-8')
        .then(JSON.parse);
    }),
  );
};

// The nestpay response fixtures are based on this client ID and key.
const nestpayProcessor = {
  name: sdk.storePaymentMethods.PaymentMethodNames.CREDIT_CARD,
  processor: sdk.storePaymentMethods.PaymentProcessors.HALKBANK,
  clientId: '180000063',
  clientKey: 'SKEY0063',
};

const normalizeNestpayFixture = (fixture: any, order: any) => {
  fixture.request.amount = order.calculatedTotal;
  fixture.request.oid = Array.isArray(fixture.request.oid)
    ? [order._id, order._id]
    : order._id;
  const localHash = nestpay.getHashFromResponse(
    nestpayProcessor.clientKey,
    fixture.request,
  );
  fixture.request.HASH = localHash?.hash;
  fixture.request.HASHPARAMSVAL = localHash?.paramsVal;
  fixture.response.forOrder = order._id;
};

describe('"orderPayments" service', () => {
  let feathersApp: Application;
  let orderPayments: Service<OrderPayments>;
  let testUsers: User[];
  let testStores: Store[];
  let testDeliveries: Delivery[];
  let testAddresses: Address[];
  let testProducts: Product[];
  let testOrders: Order[];

  beforeAll(async () => {
    feathersApp = await setup();
    orderPayments = feathersApp.service('orderPayments');
    await fixtures.category(feathersApp, 1);
    testUsers = await fixtures.user(feathersApp, 1);
    testStores = await fixtures.store(feathersApp, 1, [
      { authenticated: true, user: testUsers[0] },
    ]);

    testDeliveries = await fixtures.delivery(
      feathersApp,
      1,
      getExternalUserParams(testUsers[0]),
      { forStore: testStores[0]._id },
    );

    testAddresses = await fixtures.address(
      feathersApp,
      1,
      getExternalUserParams(testUsers[0]),
      { addressFor: testUsers[0]._id },
    );

    testProducts = await fixtures.product(
      feathersApp,
      1,
      getExternalUserParams(testUsers[0]),
    );

    testOrders = await fixtures.order(
      feathersApp,
      1,
      getExternalUserParams(testUsers[0]),
      [
        {
          orderedFrom: testStores[0]._id,
          orderedBy: testUsers[0]._id,
          ordered: [{ product: testProducts[0], quantity: 2 }],
          delivery: testDeliveries[0],
          deliverTo: testAddresses[0],
          paymentMethod: sdk.storePaymentMethods.PaymentMethodNames.CREDIT_CARD,
        },
      ],
    );

    const storePayments = (
      await feathersApp
        .service('storePaymentMethods')
        .find({ query: { forStore: testStores[0]._id } })
    ).data[0];

    await feathersApp
      .service('storePaymentMethods')
      .patch(storePayments._id, { methods: [nestpayProcessor] });
  });

  it('find, get, patch and remove are disallowed for external calls', async () => {
    expect.assertions(4);
    const params = getExternalUserParams(testUsers[0]);
    const findPromise = orderPayments.find({
      ...params,
      query: {
        forOrder: testStores[0]._id,
      },
    });

    const getPromise = orderPayments.get('12345', params);
    const patchPromise = orderPayments.patch(
      '12345',
      { forOrder: '3456' },
      params,
    );
    const removePromise = orderPayments.remove('12345', params);

    await expect(findPromise).rejects.toThrow(MethodNotAllowed);
    await expect(getPromise).rejects.toThrow(MethodNotAllowed);
    await expect(patchPromise).rejects.toThrow(MethodNotAllowed);
    await expect(removePromise).rejects.toThrow(MethodNotAllowed);
  });

  it('nestpay is handled correctly', async () => {
    const nestpayFixtures = await getFixturesContent('nestpay');
    const responses = await Bluebird.map(nestpayFixtures, async fixture => {
      normalizeNestpayFixture(fixture, testOrders[0]);
      const response = await orderPayments.create(fixture.request, {
        provider: 'rest',
      });

      return [fixture, response];
    });

    responses.forEach(([fixture, response]) =>
      expect(response).toEqual(fixture.response),
    );
  });

  it('create throws if order price and transaction amount do not match', async () => {
    const [fixture] = await getFixturesContent('nestpay');
    normalizeNestpayFixture(fixture, testOrders[0]);
    fixture.request.amount = '12345';

    const response = orderPayments.create(fixture.request, {
      provider: 'rest',
    });

    await expect(response).rejects.toThrow(BadRequest);
  });
});
