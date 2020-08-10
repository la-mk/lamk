import { sum, first } from 'lodash';
import { OrderProduct } from '../models/product';
import { Delivery } from '../models/delivery';
import { Campaign, RewardTypes, ProductRuleTypes } from '../models/campaign';

export interface PricingProduct {
  product: Pick<
    OrderProduct,
    'price' | 'discount' | 'calculatedPrice' | 'groups'
  >;
  quantity: number;
}

export type PricingCampaign = Pick<Campaign, 'productRules' | 'reward'>;

const round = (num: number) => {
  if (!num) {
    return num;
  }

  // We round to one decimal, for other currencies it might make sense to round to more decimals.
  return Math.round(num * 10) / 10;
};

export const calculateProductPrice = (
  product: Pick<OrderProduct, 'price' | 'discount'>
) => {
  return product.price - (product.discount ?? 0);
};

const calculateProductTotal = (product: PricingProduct) => {
  return (
    (product.product.calculatedPrice ??
      calculateProductPrice(product.product)) * (product.quantity ?? 1)
  );
};

export const calculateProductsTotal = (
  productsWithQuantity: PricingProduct[]
) => {
  return sum(
    productsWithQuantity.map(product => calculateProductTotal(product))
  );
};

const calculateWithDiscountCampaign = (
  campaign: PricingCampaign,
  product: PricingProduct
) => {
  const productPrice = calculateProductTotal(product);

  switch (campaign.reward.type) {
    case RewardTypes.PERCENTAGE_DISCOUNT: {
      return productPrice - productPrice * ((campaign.reward.value ?? 0) / 100);
    }

    case RewardTypes.CONSTANT_DISCOUNT: {
      return productPrice - (campaign.reward.value ?? 0);
    }
  }
};

const isCampaignApplicable = (
  campaign: PricingCampaign,
  product: PricingProduct
) => {
  return campaign.productRules.some(rule => {
    if (rule.type === ProductRuleTypes.ALL) {
      return true;
    }
    if (rule.type === ProductRuleTypes.GROUP) {
      return product.product.groups.includes(rule.value);
    }

    return false;
  });
};

export const getBestCampaign = (
  campaigns: PricingCampaign[],
  product: PricingProduct
) => {
  const applicableCampaigns = campaigns.filter(campaign =>
    isCampaignApplicable(campaign, product)
  );
  return first(
    applicableCampaigns.sort((a, b) => {
      return (
        calculateWithDiscountCampaign(a, product) -
        calculateWithDiscountCampaign(b, product)
      );
    })
  );
};

export const calculateWithCampaignsTotal = (
  campaigns: PricingCampaign[],
  productsWithQuantity: PricingProduct[]
) => {
  return productsWithQuantity.reduce((withCampaigns: number, product) => {
    const bestCampaign = getBestCampaign(campaigns, product);
    if (!bestCampaign) {
      return withCampaigns + calculateProductTotal(product);
    }

    return withCampaigns + calculateWithDiscountCampaign(bestCampaign, product);
  }, 0);
};

export const calculatePrices = (
  productsWithQuantity: PricingProduct[],
  delivery?: Pick<Delivery, 'freeDeliveryOver' | 'price'>,
  campaigns: PricingCampaign[] = []
) => {
  const productsTotal = round(calculateProductsTotal(productsWithQuantity));
  let withCampaignsTotal = round(
    calculateWithCampaignsTotal(campaigns, productsWithQuantity)
  );
  // We don't want to allow the withCampaigns value to drop below 0, as it doesn't make any sense.
  withCampaignsTotal = withCampaignsTotal < 0 ? 0 : withCampaignsTotal;
  const deliveryTotal = delivery
    ? round(delivery.freeDeliveryOver < withCampaignsTotal ? 0 : delivery.price)
    : 0;
  const total = round(withCampaignsTotal + (deliveryTotal ?? 0));

  return {
    productsTotal,
    withCampaignsTotal,
    deliveryTotal,
    total,
  };
};
