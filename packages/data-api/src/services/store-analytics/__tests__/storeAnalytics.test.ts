import setup from '../../../server/server';
import { Application } from '@feathersjs/express';
import { Service } from '@feathersjs/feathers';
import { User } from '@sradevski/la-sdk/dist/models/user';
import { getExternalUserParams } from '../../../../tests/utils';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { Category } from '@sradevski/la-sdk/dist/models/category';
import { sdk } from '@sradevski/la-sdk';
import { Delivery } from '@sradevski/la-sdk/dist/models/delivery';
import { Address } from '@sradevski/la-sdk/dist/models/address/address';
import { GeneralError } from '../../../common/errors';

const userFixture = {
  email: 'store-analytics@fixture.com',
  password: 'supersecret',
};

const user2Fixture = {
  email: 'store-analytics2@fixture.com',
  password: 'supersecret',
};

const storeFixture = {
  name: 'Test store',
  slug: 'store-analytics-test',
  logo: '2345',
  company: {
    companyName: 'Test',
    companyAddress: 'Test',
    registryNumber: 'Test',
    taxNumber: 'Test',
  },
  contact: {
    email: 'store-analytics@test.com',
    phoneNumber: '12345',
  },
  isPublished: true,
};

const categoryFixture: Partial<Category> = {
  level1: 'some-category',
  level2: 'some-category',
  level3: 'some-category',
};

const productFixture: Partial<Product> = {
  name: 'Test product',
  unit: sdk.product.ProductUnit.ITEM,
  price: 150,
  category: 'some-category',
  images: [] as string[],
  groups: [] as string[],
};

const deliveryFixture: Partial<Delivery> = {
  method: sdk.delivery.DeliveryMethods.CARGO_PICKUP,
  price: 120,
  freeDeliveryOver: 2000,
};

const addressFixture = {
  name: 'Test address',
  country: 'MK',
  region: 'Bitola',
  city: 'Bitola',
  zip: '7000',
  street: 'Unknown',
  person: 'Addresses',
  phoneNumber: '1234567',
};

describe('"storeAnalytics" service', () => {
  let feathersApp: Application;
  let storeAnalytics: Service<any>;
  let testUser: User;
  let testUser2: User;
  let testStore: Store;
  let testStore2: Store;
  let testDelivery: Delivery;
  let testAddress: Address;
  let testProduct: Product;

  beforeAll(async () => {
    feathersApp = await setup();
    storeAnalytics = feathersApp.service('storeAnalytics');
    await feathersApp.service('categories').create(categoryFixture);
    testUser = await feathersApp.service('users').create(userFixture);
    testUser2 = await feathersApp.service('users').create(user2Fixture);
    testStore = await feathersApp.service('stores').create(storeFixture, {
      authenticated: true,
      user: testUser,
    });
    testStore2 = await feathersApp.service('stores').create(storeFixture, {
      authenticated: true,
      user: testUser2,
    });

    testDelivery = await feathersApp
      .service('deliveries')
      .create(
        { forStore: testStore._id, ...deliveryFixture },
        getExternalUserParams(testUser),
      );

    testAddress = await feathersApp.service('addresses').create(
      {
        ...addressFixture,
        addressFor: testUser._id,
      },
      getExternalUserParams(testUser),
    );

    testProduct = await feathersApp
      .service('products')
      .create(productFixture, getExternalUserParams(testUser));

    await feathersApp.service('orders').create(
      {
        orderedFrom: testStore._id,
        orderedBy: testUser._id,
        status: sdk.order.OrderStatus.PENDING,
        ordered: [{ product: testProduct, quantity: 2 }],
        campaigns: [],
        delivery: testDelivery,
        deliverTo: testAddress,
      },
      getExternalUserParams(testUser),
    );
  });

  it('get returns analytics for store regardless of the passed id', async () => {
    const params = getExternalUserParams(testUser);
    const res = await storeAnalytics.get('', {
      query: {
        forStore: testStore._id,
        type: sdk.storeAnalytics.AnalyticsTypes.PRODUCTS_COUNT,
      },
      ...params,
    });

    expect(res[sdk.storeAnalytics.AnalyticsTypes.PRODUCTS_COUNT]).toBe(1);
  });

  it('get returns for owner even if fetching other store analytics', async () => {
    const params = getExternalUserParams(testUser);
    const res = await storeAnalytics.get('', {
      query: {
        forStore: testStore2._id,
        type: sdk.storeAnalytics.AnalyticsTypes.PRODUCTS_COUNT,
      },
      ...params,
    });
    expect(res[sdk.storeAnalytics.AnalyticsTypes.PRODUCTS_COUNT]).toBe(1);
  });

  it('throws if nonexistent type is passed', async () => {
    expect.assertions(1);

    const params = getExternalUserParams(testUser);
    const analyticsPromise = storeAnalytics.get('', {
      query: {
        forStore: testStore._id,
        type: 'non-existent',
      },
      ...params,
    });

    await expect(analyticsPromise).rejects.toThrow(GeneralError);
  });

  it('get returns the expected product count for store', async () => {
    const params = getExternalUserParams(testUser);
    const analytics = await storeAnalytics.get('', {
      query: {
        forStore: testStore._id,
        type: sdk.storeAnalytics.AnalyticsTypes.PRODUCTS_COUNT,
      },
      ...params,
    });

    expect(analytics[sdk.storeAnalytics.AnalyticsTypes.PRODUCTS_COUNT]).toBe(1);
  });

  it('get returns the expected order count for store', async () => {
    const params = getExternalUserParams(testUser);
    const analytics = await storeAnalytics.get('', {
      query: {
        forStore: testStore._id,
        type: sdk.storeAnalytics.AnalyticsTypes.ORDERS_COUNT,
      },
      ...params,
    });

    expect(analytics[sdk.storeAnalytics.AnalyticsTypes.ORDERS_COUNT]).toBe(1);
  });

  it('get returns the expected revenue for store', async () => {
    const params = getExternalUserParams(testUser);
    const analytics = await storeAnalytics.get('', {
      query: {
        forStore: testStore._id,
        type: sdk.storeAnalytics.AnalyticsTypes.REVENUE,
      },
      ...params,
    });

    expect(analytics[sdk.storeAnalytics.AnalyticsTypes.REVENUE].pending).toBe(
      420,
    );
  });
});
