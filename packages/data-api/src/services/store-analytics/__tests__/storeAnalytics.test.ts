import setup from '../../../server/server';
import { Application } from '@feathersjs/express';
import { Service } from '@feathersjs/feathers';
import { User } from '@la-mk/la-sdk/dist/models/user';
import { getExternalUserParams } from '../../../../tests/utils';
import { Product, OrderProduct } from '@la-mk/la-sdk/dist/models/product';
import { Store } from '@la-mk/la-sdk/dist/models/store';
import { sdk } from '@la-mk/la-sdk';
import { Delivery } from '@la-mk/la-sdk/dist/models/delivery';
import { Address } from '@la-mk/la-sdk/dist/models/address/address';
import fixtures from '../../../../tests/fixtures';
import { Order } from '@la-mk/la-sdk/dist/models/order';

describe('"storeAnalytics" service', () => {
  let feathersApp: Application;
  let storeAnalytics: Service<any>;
  let testUsers: User[];
  let testStores: Store[];
  let testDeliveries: Delivery[];
  let testAddresses: Address[];
  let testProducts: Product[];
  let testOrders: Order[];

  beforeAll(async () => {
    feathersApp = await setup();
    storeAnalytics = feathersApp.service('storeAnalytics');
    await fixtures.category(feathersApp, 1);
    testUsers = await fixtures.user(feathersApp, 2);
    testStores = await fixtures.store(feathersApp, 2, [
      { authenticated: true, user: testUsers[0] },
      { authenticated: true, user: testUsers[1] },
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
          ordered: [
            {
              product: sdk.product.convertToOrderProduct(
                testProducts[0],
              ) as OrderProduct,
              quantity: 2,
            },
          ],
          deliveryStatus: sdk.order.DeliveryStatus.UNKNOWN,
          deliveryEvents: [],
          delivery: testDeliveries[0],
          deliverTo: testAddresses[0],
        },
      ],
    );
  });

  it('get returns analytics for store regardless of the passed id', async () => {
    const params = getExternalUserParams(testUsers[0]);
    const res = await storeAnalytics.get('', {
      query: {
        forStore: testStores[0]._id,
        type: sdk.storeAnalytics.AnalyticsTypes.TOTAL_PRODUCT_COUNT,
      },
      ...params,
    });

    expect(res[sdk.storeAnalytics.AnalyticsTypes.TOTAL_PRODUCT_COUNT]).toBe(1);
  });

  it('get returns for owner even if fetching other store analytics', async () => {
    const params = getExternalUserParams(testUsers[0]);
    const res = await storeAnalytics.get('', {
      query: {
        forStore: testStores[1]._id,
        type: sdk.storeAnalytics.AnalyticsTypes.TOTAL_PRODUCT_COUNT,
      },
      ...params,
    });
    expect(res[sdk.storeAnalytics.AnalyticsTypes.TOTAL_PRODUCT_COUNT]).toBe(1);
  });

  it('returns an empty array if nonexistent type is passed', async () => {
    expect.assertions(1);

    const params = getExternalUserParams(testUsers[0]);
    const res = await storeAnalytics.get('', {
      query: {
        forStore: testStores[0]._id,
        type: 'non-existent',
      },
      ...params,
    });

    expect(res).toEqual({ 'non-existent': [] });
  });

  it('get returns the expected product count for store', async () => {
    const params = getExternalUserParams(testUsers[0]);
    const analytics = await storeAnalytics.get('', {
      query: {
        forStore: testStores[0]._id,
        type: sdk.storeAnalytics.AnalyticsTypes.TOTAL_PRODUCT_COUNT,
      },
      ...params,
    });

    expect(
      analytics[sdk.storeAnalytics.AnalyticsTypes.TOTAL_PRODUCT_COUNT],
    ).toBe(1);
  });

  it('get returns the expected order count for store', async () => {
    const params = getExternalUserParams(testUsers[0]);
    const analytics = await storeAnalytics.get('', {
      query: {
        forStore: testStores[0]._id,
        type: sdk.storeAnalytics.AnalyticsTypes.TOTAL_ORDER_COUNT,
      },
      ...params,
    });

    expect(analytics[sdk.storeAnalytics.AnalyticsTypes.TOTAL_ORDER_COUNT]).toBe(
      1,
    );
  });

  it('get returns the expected revenue for store', async () => {
    const params = getExternalUserParams(testUsers[0]);
    const analytics = await storeAnalytics.get('', {
      query: {
        forStore: testStores[0]._id,
        type: sdk.storeAnalytics.AnalyticsTypes.TOTAL_REVENUE,
      },
      ...params,
    });

    const price = sdk.utils.pricing.calculatePrices(
      testOrders[0].ordered,
      testOrders[0].delivery,
      testOrders[0].campaigns,
    );

    expect(analytics[sdk.storeAnalytics.AnalyticsTypes.TOTAL_REVENUE]).toBe(
      price.total,
    );
  });
});
