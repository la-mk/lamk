import merge from 'lodash/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';
import { JSONSchemaType } from 'ajv';

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

export const schema: JSONSchemaType<Campaign> = {
  type: 'object',
  additionalProperties: false,
  required: [
    ...defaultSchemaEntries.required,
    'forStore',
    'name',
    'isActive',
    'isPromoted',
    'type',
    'reward',
    'productRules',
  ],
  properties: {
    ...defaultSchemaEntries.properties!,
    forStore: {
      type: 'string',
      format: 'uuid',
    },
    name: {
      type: 'string',
      minLength: 2,
      maxLength: 255,
    },
    isActive: {
      type: 'boolean',
      default: false,
    },
    isPromoted: {
      type: 'boolean',
      default: false,
    },
    type: {
      type: 'string',
      enum: Object.values(CampaignTypes),
      default: CampaignTypes.CART_DISCOUNT,
    },
    // @ts-ignore
    reward: {
      oneOf: [
        {
          type: 'object',
          additionalProperties: false,
          required: ['type', 'value'],
          properties: {
            type: {
              type: 'string',
              const: RewardTypes.PERCENTAGE_DISCOUNT,
            },
            value: {
              type: 'number',
              exclusiveMinimum: 0,
              exclusiveMaximum: 100,
            },
          },
        },
        {
          type: 'object',
          additionalProperties: false,
          required: ['type', 'value'],
          properties: {
            type: {
              type: 'string',
              const: RewardTypes.CONSTANT_DISCOUNT,
            },
            value: {
              type: 'number',
              exclusiveMinimum: 0,
            },
          },
        },
      ],
    },
    productRules: {
      type: 'array',
      // For now we only allow a single rule
      minItems: 1,
      maxItems: 1,
      //@ts-ignore
      items: {
        oneOf: [
          {
            type: 'object',
            additionalProperties: false,
            required: ['type', 'value'],
            // @ts-ignore the typings don't understand dependencies
            properties: {
              type: {
                type: 'string',
                enum: Object.values(ProductRuleTypes),
                default: ProductRuleTypes.ALL,
              },
              value: {
                type: 'string',
                enum: ['all'],
                default: 'all',
              },
            },
          },
          {
            type: 'object',
            additionalProperties: false,
            required: ['type', 'value'],
            // @ts-ignore the typings don't understand dependencies
            properties: {
              type: {
                type: 'string',
                enum: Object.values(ProductRuleTypes),
                default: ProductRuleTypes.ALL,
              },
              value: {
                type: 'string',
                minLength: 2,
                maxLength: 127,
              },
            },
          },
        ],
      },
    },
  },
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
  productRules: {
    type: ProductRuleTypes;
    value: string;
  }[];
  // For now we don't need to support customer rules and redemption budgets, as well as certain types of campaigns.
  // customerRules: [{type: 'new', 'loyal' ..., value: 'rank3' }];
  // redemptionLimit?: number;
  // redemptionBudget?: number;
}

export const getCampaignSdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<Campaign>, Campaign>(
    client,
    'campaigns'
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
    schema,
  };
};
