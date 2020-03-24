import setup from '../../../server/server';
import { Application } from '@feathersjs/express';
import {
  NotAuthenticated,
  BadRequest,
  MethodNotAllowed,
} from '../../../common/errors';
import { Service } from '@feathersjs/feathers';
import { User } from '@sradevski/la-sdk/dist/models/user';
import { getExternalUserParams } from '../../../../tests/utils';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { sdk } from '@sradevski/la-sdk';
import { StorePaymentMethods } from '@sradevski/la-sdk/dist/models/storePaymentMethods';
import fixtures from '../../../../tests/fixtures';

describe('"storePaymentMethods" service', () => {
  let feathersApp: Application;
  let storePaymentMethods: Service<StorePaymentMethods>;
  let testUsers: User[];
  let testStores: Store[];
  let testStorePaymentMethods: StorePaymentMethods;

  beforeAll(async () => {
    feathersApp = await setup();
    storePaymentMethods = feathersApp.service('storePaymentMethods');
    testUsers = await fixtures.user(feathersApp, 1);
    testStores = await fixtures.store(feathersApp, 1, {
      authenticated: true,
      user: testUsers[0],
    });

    // This implicitly tests that the storepayment is created on store creation.
    testStorePaymentMethods = ((await storePaymentMethods.find({
      query: {
        forStore: testStores[0]._id,
      },
    })) as FindResult<StorePaymentMethods>).data[0];
  });

  it('create and remove are disallowed for external calls', async () => {
    expect.assertions(2);
    const params = getExternalUserParams(testUsers[0]);
    const createPromise = storePaymentMethods.create(
      {
        forStore: testStores[0]._id,
        methods: [
          { name: sdk.storePaymentMethods.PaymentMethodNames.PAY_ON_DELIVERY },
        ],
      },
      params,
    );

    const removePromise = storePaymentMethods.remove('12345', params);

    await expect(createPromise).rejects.toThrow(MethodNotAllowed);
    await expect(removePromise).rejects.toThrow(MethodNotAllowed);
  });

  it('patch throws if not authenticated', async () => {
    expect.assertions(1);
    const patchPromise = storePaymentMethods.patch(
      testStorePaymentMethods._id,
      {
        methods: [
          { name: sdk.storePaymentMethods.PaymentMethodNames.PAY_ON_DELIVERY },
        ],
      },
      {
        provider: 'rest',
      },
    );

    await expect(patchPromise).rejects.toThrow(NotAuthenticated);
  });

  it('patching with no payment methods fails', async () => {
    const params = getExternalUserParams(testUsers[0]);
    const patchPromise = storePaymentMethods.patch(
      testStorePaymentMethods._id,
      { methods: [] },
      params,
    );

    await expect(patchPromise).rejects.toThrow(BadRequest);
  });

  it('patching with non-existent payment methods fails', async () => {
    const params = getExternalUserParams(testUsers[0]);
    // @ts-ignore
    const patchPromise = storePaymentMethods.patch(
      testStorePaymentMethods._id,
      { methods: [{ name: 'somemethod' }] },
      params,
    );

    await expect(patchPromise).rejects.toThrow(BadRequest);
  });

  it('patching with non-existent processor methods fails', async () => {
    const params = getExternalUserParams(testUsers[0]);
    // @ts-ignore
    const patchPromise = storePaymentMethods.patch(
      testStorePaymentMethods._id,
      {
        methods: [
          {
            name: sdk.storePaymentMethods.PaymentMethodNames.CREDIT_CARD,
            processor: 'someprocessor',
          },
        ],
      },
      params,
    );

    await expect(patchPromise).rejects.toThrow(BadRequest);
  });
});
