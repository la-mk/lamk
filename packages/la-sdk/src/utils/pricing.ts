import { sum, first } from 'lodash';
import { Product } from '../models/product';
import { Delivery } from '../models/delivery';
import { Campaign, RewardTypes } from '../models/campaign';
import { OrderItem } from '../models/order';
import { CartItemWithProduct } from '../models/cart';

const round = (num: number) => {
  if (!num) {
    return num;
  }

  // We round to one decimal, for other currencies it might make sense to round to more decimals.
  return Math.round(num * 10) / 10;
};

export const calculateProductPrice = (
  product: Pick<Product, 'price' | 'discount'>
) => {
  return product.price - (product.discount ?? 0);
};

export const calculateProductsTotal = (
  productsWithQuantity: (CartItemWithProduct | OrderItem)[]
) => {
  return sum(
    productsWithQuantity.map(
      ({ product, quantity }) =>
        (product.calculatedPrice ?? calculateProductPrice(product)) *
        (quantity ?? 1)
    )
  );
};

const calculateWithDiscountCampaign = (
  campaign: Campaign,
  productsTotal: number
) => {
  switch (campaign.reward.type) {
    case RewardTypes.PERCENTAGE_DISCOUNT: {
      return (
        productsTotal - productsTotal * ((campaign.reward.value ?? 0) / 100)
      );
    }

    case RewardTypes.CONSTANT_DISCOUNT: {
      return productsTotal - (campaign.reward.value ?? 0);
    }
  }
};

const getBestCampaign = (campaigns: Campaign[], productsTotal: number) => {
  return first(
    campaigns.sort((a, b) => {
      return (
        calculateWithDiscountCampaign(a, productsTotal) -
        calculateWithDiscountCampaign(b, productsTotal)
      );
    })
  );
};

export const getApplicableCampaigns = (
  campaigns: Campaign[],
  productsWithQuantity: (CartItemWithProduct | OrderItem)[]
) => {
  // For now, there can only be a single campaign applied to all products, so we just get the one that has the best reward. Price calculation will be much more complex as other types of campaigns will be supported.
  const productsTotal = calculateProductsTotal(productsWithQuantity);
  const bestCampaign = getBestCampaign(campaigns, productsTotal);
  return bestCampaign ? [bestCampaign] : [];
};

export const calculateWithCampaignsTotal = (
  campaigns: Campaign[],
  productsWithQuantity: (CartItemWithProduct | OrderItem)[],
  productsTotal: number
) => {
  const bestCampaign = getApplicableCampaigns(
    campaigns,
    productsWithQuantity
  )[0];
  return bestCampaign
    ? calculateWithDiscountCampaign(bestCampaign, productsTotal)
    : productsTotal;
};

export const calculatePrices = (
  productsWithQuantity: (CartItemWithProduct | OrderItem)[],
  delivery?: Pick<Delivery, 'freeDeliveryOver' | 'price'>,
  campaigns: Campaign[] = []
) => {
  const productsTotal = round(calculateProductsTotal(productsWithQuantity));
  let withCampaignsTotal = round(
    calculateWithCampaignsTotal(campaigns, productsWithQuantity, productsTotal)
  );
  // We don't want to allow the withCampaigns value to drop below 0, as it doesn't make any sense.
  withCampaignsTotal = withCampaignsTotal < 0 ? 0 : withCampaignsTotal;
  const deliveryTotal = delivery
    ? round(delivery.freeDeliveryOver < withCampaignsTotal ? 0 : delivery.price)
    : undefined;
  const total = round(withCampaignsTotal + (deliveryTotal ?? 0));

  return {
    productsTotal,
    withCampaignsTotal,
    deliveryTotal,
    total,
  };
};
