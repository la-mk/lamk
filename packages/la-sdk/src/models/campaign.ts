import merge from 'lodash/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import v8n from 'v8n';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';

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
  ...defaultSchemaEntries,
  forStore: v8n().id(),
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
};

export interface Campaign extends DefaultSchema {
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
}

export const getCampaignSdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<Campaign>, Campaign>(
    client,
    'campaigns',
  );

  return {
    ...crudMethods,

    findForStore: (storeId: string, params?: Params) => {
      const options = {};
      merge(options, params, { query: { forStore: storeId } });
      return crudMethods.find(options);
    },

    findActiveForStore: (storeId: string, params?: Params) => {
      const options = {};
      merge(options, params, { query: { forStore: storeId, isActive: true } });
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
