import * as pricing from '../pricing';
import { ProductRuleTypes, RewardTypes } from '../../models/campaign';

const productFixture = {
  price: 200,
  discount: 100,
  calculatedPrice: 100,
};

const orderItemFixtures = [
  {
    product: {
      price: 200,
      discount: 100,
      calculatedPrice: 100,
      groups: [],
    },
    quantity: 2,
  },
  {
    product: {
      price: 500,
      discount: undefined,
      calculatedPrice: 500,
      groups: ['some-group'],
    },
    quantity: 1,
  },
];

const deliveryFixture = {
  price: 120,
  freeDeliveryOver: 2000,
};

const campaignFixtures = [
  {
    reward: {
      type: RewardTypes.PERCENTAGE_DISCOUNT,
      value: 20,
    },
    productRules: [
      {
        type: ProductRuleTypes.ALL,
        value: 'all',
      },
    ] as any,
  },
];

describe('calculateProductPrice utility', () => {
  test('calculates value correctly without discount', () => {
    expect(
      pricing.calculateProductPrice({ ...productFixture, discount: undefined })
    ).toBe(200);
  });

  test('calculates value correctly with discount', () => {
    expect(pricing.calculateProductPrice(productFixture)).toBe(100);
  });
});

describe('calculatePrices utility', () => {
  test('calculates value correctly for a single product with no campaigns', () => {
    expect(pricing.calculatePrices([orderItemFixtures[0]])).toEqual({
      productsTotal: 200,
      withCampaignsTotal: 200,
      deliveryTotal: 0,
      total: 200,
    });
  });

  test('calculates value correctly for two products with no campaigns', () => {
    expect(pricing.calculatePrices(orderItemFixtures)).toEqual({
      productsTotal: 700,
      withCampaignsTotal: 700,
      deliveryTotal: 0,
      total: 700,
    });
  });

  test('calculates value correctly with delivery', () => {
    expect(pricing.calculatePrices(orderItemFixtures, deliveryFixture)).toEqual(
      {
        productsTotal: 700,
        withCampaignsTotal: 700,
        deliveryTotal: 120,
        total: 820,
      }
    );
  });

  test('calculates value correctly with delivery over free shipping', () => {
    expect(
      pricing.calculatePrices(orderItemFixtures, {
        ...deliveryFixture,
        freeDeliveryOver: 500,
      })
    ).toEqual({
      productsTotal: 700,
      withCampaignsTotal: 700,
      deliveryTotal: 0,
      total: 700,
    });
  });

  test('calculates value correctly with percentage discount campaign to all products', () => {
    expect(
      pricing.calculatePrices(
        orderItemFixtures,
        deliveryFixture,
        campaignFixtures
      )
    ).toEqual({
      productsTotal: 700,
      withCampaignsTotal: 560,
      deliveryTotal: 120,
      total: 680,
    });
  });

  test('calculates value correctly with free delivery and percentage discount campaign to all products', () => {
    expect(
      pricing.calculatePrices(
        orderItemFixtures,
        { ...deliveryFixture, freeDeliveryOver: 300 },
        campaignFixtures
      )
    ).toEqual({
      productsTotal: 700,
      withCampaignsTotal: 560,
      deliveryTotal: 0,
      total: 560,
    });
  });

  test('calculates value correctly with percentage discount campaign to group products', () => {
    expect(
      pricing.calculatePrices(
        orderItemFixtures,
        { ...deliveryFixture, freeDeliveryOver: 300 },
        [
          {
            ...campaignFixtures[0],
            productRules: [
              { type: ProductRuleTypes.GROUP, value: 'some-group' },
            ],
          },
        ] as any
      )
    ).toEqual({
      productsTotal: 700,
      withCampaignsTotal: 600,
      deliveryTotal: 0,
      total: 600,
    });
  });

  test('calculates value correctly with multiple campaigns', () => {
    expect(
      pricing.calculatePrices(orderItemFixtures, deliveryFixture, [
        ...campaignFixtures,
        {
          reward: {
            type: RewardTypes.CONSTANT_DISCOUNT,
            value: 200,
          },
          productRules: [{ type: ProductRuleTypes.GROUP, value: 'some-group' }],
        },
      ] as any)
    ).toEqual({
      productsTotal: 700,
      withCampaignsTotal: 460,
      deliveryTotal: 120,
      total: 580,
    });
  });
});
