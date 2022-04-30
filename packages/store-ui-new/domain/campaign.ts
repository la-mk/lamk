export enum RewardTypes {
  PERCENTAGE_DISCOUNT = 'percentage-discount',
  CONSTANT_DISCOUNT = 'constant-discount',
}
export enum CampaignTypes {
  CART_DISCOUNT = 'cart-discount',
}
export enum ProductRuleTypes {
  ALL = 'all',
  GROUP = 'group',
}
export interface Campaign {
  forStore: string;
  name: string;
  isActive: boolean;
  isPromoted: boolean;
  type: CampaignTypes;
  reward: {
    type: RewardTypes;
    value: number;
  };
  productRules: {
    type: ProductRuleTypes;
    value: string;
  }[];
}
