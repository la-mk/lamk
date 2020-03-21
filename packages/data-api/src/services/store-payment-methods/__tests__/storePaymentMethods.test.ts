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

const userFixture = {
  email: 'storePaymentMethods@fixture.com',
  password: 'supersecret',
};

const storeFixture: Partial<Store> = {
  name: 'Test storePaymentMethods',
  slug: 'storePaymentMethods-test',
  logo: '2345',
  company: {
    companyName: 'Test',
    companyAddress: 'Test',
    registryNumber: 'Test',
    taxNumber: 'Test',
  },
  contact: {
    email: 'storePaymentMethods@test.com',
    phoneNumber: '23456',
  },
  isPublished: true,
};

describe('"storePaymentMethods" service', () => {
  let feathersApp: Application;
  let users: Service<User>;
  let storePaymentMethods: Service<StorePaymentMethods>;
  let stores: Service<Store>;
  let testUser: User;
  let testStore: Store;
  let testStorePaymentMethods: StorePaymentMethods;

  beforeAll(async () => {
    feathersApp = await setup();
    users = feathersApp.service('users');
    storePaymentMethods = feathersApp.service('storePaymentMethods');
    stores = feathersApp.service('stores');
    testUser = await users.create(userFixture);
    testStore = await stores.create(storeFixture, {
      authenticated: true,
      user: testUser,
    });

    // This implicitly tests that the storepayment is created on store creation.
    testStorePaymentMethods = ((await storePaymentMethods.find({
      query: {
        forStore: testStore._id,
      },
    })) as FindResult<StorePaymentMethods>).data[0];
  });

  it('create and remove are disallowed for external calls', async () => {
    expect.assertions(2);
    const params = getExternalUserParams(testUser);
    const createPromise = storePaymentMethods.create(
      {
        forStore: testStore._id,
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
    const params = getExternalUserParams(testUser);
    const patchPromise = storePaymentMethods.patch(
      testStorePaymentMethods._id,
      { methods: [] },
      params,
    );

    await expect(patchPromise).rejects.toThrow(BadRequest);
  });

  it('patching with non-existent payment methods fails', async () => {
    const params = getExternalUserParams(testUser);
    // @ts-ignore
    const patchPromise = storePaymentMethods.patch(
      testStorePaymentMethods._id,
      { methods: [{ name: 'somemethod' }] },
      params,
    );

    await expect(patchPromise).rejects.toThrow(BadRequest);
  });

  it('patching with non-existent processor methods fails', async () => {
    const params = getExternalUserParams(testUser);
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
