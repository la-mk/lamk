import {sum, last} from 'lodash';
import { Product } from '../models/product';
import { Delivery } from '../models/delivery';
import { Campaign, RewardTypes } from '../models/campaign';
import { OrderItem } from '../models/order';
import { CartItemWithProduct } from '../models/cart';

export const calculateProductPrice = (product: Pick<Product, 'price' | 'discount'>) => {
  return product.price - (product.discount ?? 0);
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

export const calculatePrices = (productsWithQuantity: (CartItemWithProduct | OrderItem)[], delivery?: Pick<Delivery, 'freeDeliveryOver' | 'price'>, campaigns: Pick<Campaign, 'reward'>[] = []) => {

  const productsTotal = sum(
    productsWithQuantity.map(
      ({product, quantity}) => (product.calculatedPrice ?? calculateProductPrice(product)) * (quantity ?? 1)
    ));
  
  const bestCampaign = getBestCampaign(campaigns, productsTotal);
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