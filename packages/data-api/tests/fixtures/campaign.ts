import { Campaign } from '@sradevski/la-sdk/dist/models/campaign';
import { sdk } from '@sradevski/la-sdk';
import { defaultGenerator, GeneratorFunc } from './helpers';

const defaultFixture: Partial<Campaign> = {
  name: 'Test campaign',
  isActive: true,
  isPromoted: false,
  type: sdk.campaign.CampaignTypes.CART_DISCOUNT,
  reward: {
    type: sdk.campaign.RewardTypes.PERCENTAGE_DISCOUNT,
    value: 20,
  },
  productRules: [
    {
      type: sdk.campaign.ProductRuleTypes.ALL,
      value: 'all',
    },
  ],
};

export default {
  generator: (...args) =>
    defaultGenerator<Campaign>(
      {
        modelName: 'campaigns',
        defaultFixture,
        uniqueData: () => ({}),
      },
      ...args,
    ),
} as { generator: GeneratorFunc<Campaign> };
