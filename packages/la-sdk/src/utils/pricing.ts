import {sum, last} from 'lodash';
import { Product } from '../models/product';
import { Delivery } from '../models/delivery';
import { Campaign, RewardTypes } from '../models/campaign';
import { OrderItem } from '../models/order';
import { CartItemWithProduct } from '../models/cart';

export const calculateProductPrice = (product: Pick<Product, 'price' | 'discount'>) => {
  return product.price - (product.discount ?? 0);
}

export const calculateProductsTotal = (productsWithQuantity: (CartItemWithProduct | OrderItem)[]) => {
  return sum(
    productsWithQuantity.map(
      ({product, quantity}) => (product.calculatedPrice ?? calculateProductPrice(product)) * (quantity ?? 1)
    ));
}

const calculateWithDiscountCampaign = (campaign: Pick<Campaign, 'reward'>, productsTotal: number) => {
  switch(campaign.reward.type){
    case RewardTypes.PERCENTAGE_DISCOUNT: {
      return productsTotal - productsTotal * ((campaign.reward.value ?? 0) / 100);
    }

    case RewardTypes.CONSTANT_DISCOUNT: {
      return productsTotal - (campaign.reward.value ?? 0);
    }
  }
}

const getBestCampaign = (campaigns: Pick<Campaign, 'reward'>[], productsTotal: number) => {
  return last(
    campaigns.sort((a, b) => {
    return calculateWithDiscountCampaign(a, productsTotal) - calculateWithDiscountCampaign(b, productsTotal)
  }));
}

export const getApplicableCampaigns = (campaigns: Pick<Campaign, 'reward'>[], productsWithQuantity: (CartItemWithProduct | OrderItem)[]) => {
  // For now, there can only be a single campaign applied to all products, so we just get the one that has the best reward. Price calculation will be much more complex as other types of campaigns will be supported.
  const productsTotal = calculateProductsTotal(productsWithQuantity);
  const bestCampaign = getBestCampaign(campaigns, productsTotal);
  return bestCampaign ? [bestCampaign] : [];
}

export const calculatePrices = (productsWithQuantity: (CartItemWithProduct | OrderItem)[], delivery?: Pick<Delivery, 'freeDeliveryOver' | 'price'>, campaigns: Pick<Campaign, 'reward'>[] = []) => {

  const productsTotal = calculateProductsTotal(productsWithQuantity)
  const bestCampaign = getApplicableCampaigns(campaigns, productsWithQuantity)[0];
  const withCampaignsTotal = bestCampaign ? calculateWithDiscountCampaign(bestCampaign, productsTotal) : productsTotal;
  const deliveryTotal = delivery ? (delivery.freeDeliveryOver < withCampaignsTotal ? 0 : delivery.price) : undefined;
  const total = withCampaignsTotal + (deliveryTotal ?? 0);

  return {
    productsTotal,
    withCampaignsTotal,
    deliveryTotal,
    total
  }
};