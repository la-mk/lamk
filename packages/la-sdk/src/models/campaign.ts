import merge from 'lodash/fp/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import v8n from 'v8n';

export enum RewardTypes {
  PERCENTAGE_DISCOUNT = 'percentage-discount',
  CONSTANT_DISCOUNT = 'constant-discount',
}

export enum CampaignTypes {
  CART_DISCOUNT = 'cart-discount',
}

export enum ProductRuleTypes {
  ALL = 'all',
}

export const schema = {
  // ID is optional as it is autogenerated by server on creation.
  _id: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(63),
    true,
  ),
  forStore: v8n()
    .string()
    .minLength(2)
    .maxLength(63),
  name: v8n()
    .string()
    .minLength(2)
    .maxLength(255),
  // validFrom: v8n().datetime(),
  // validTo: v8n().datetime(),
  isActive: v8n().boolean(),
  isPromoted: v8n().boolean(),
  type: v8n().oneOf(Object.values(CampaignTypes)),
  reward: v8n().schema({
    type: v8n().oneOf(Object.values(RewardTypes)),
    value: v8n()
      .number()
      .positive(),
  }),
  productRules: v8n()
    .minLength(1)
    .maxLength(1)
    .every.schema({
      type: v8n().oneOf(Object.values(ProductRuleTypes)),
      value: v8n()
        .string()
        .minLength(2)
        .maxLength(127),
    }),

  // createdAt is optional as it is added by server on creation.
  createdAt: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(63),
    true,
  ),
  modifiedAt: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(63),
    true,
  ),
};

export interface Campaign {
  _id: string;
  forStore: string;
  name: string;
  // validFrom: string;
  // validTo?: string;
  isActive: boolean;
  isPromoted: boolean;
  type: CampaignTypes;
  reward: {
    type: RewardTypes;
    value: number;
  };
  productRules: [
    {
      type: ProductRuleTypes;
      value: string;
    },
  ];
  // For now we don't need to support customer rules and redemption budgets, as well as certain types of campaigns.
  // customerRules: [{type: 'new', 'loyal' ..., value: 'rank3' }];
  // redemptionLimit?: number;
  // redemptionBudget?: number;
  createdAt: string;
  modifiedAt: string;
}

export const getCampaignSdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<Campaign>, Campaign>(
    client,
    'campaigns',
  );

  return {
    ...crudMethods,

    findForStore: (storeId: string, params?: Params) => {
      const options = merge({ query: { forStore: storeId } }, params);
      return crudMethods.find(options);
    },

    validate: (data: Campaign, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },

    RewardTypes,
    CampaignTypes,
    ProductRuleTypes,
  };
};
