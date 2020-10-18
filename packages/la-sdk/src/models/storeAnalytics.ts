import merge from 'lodash/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';
import { JSONSchemaType } from 'ajv';

export enum AnalyticsTypes {
  TOTAL_PRODUCT_COUNT = 'totalProductCount',
  TOTAL_ORDER_COUNT = 'totalOrderCount',
  TOTAL_REVENUE = 'totalRevenue',

  ORDER_COUNT = 'orderCount',
  REVENUE = 'revenue',

  VISIT_COUNT = 'visitCount',
}

export enum AnalyticsFrequency {
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export const schema: JSONSchemaType<StoreAnalyticsEntry> = {
  type: 'object',
  additionalProperties: false,
  required: [
    ...defaultSchemaEntries.required,
    'forStore',
    'frequency',
    'type',
    'value',
    'timestamp',
  ],
  properties: {
    ...defaultSchemaEntries.properties!,
    forStore: {
      type: 'string',
      format: 'uuid',
    },
    frequency: {
      type: 'string',
      enum: Object.values(AnalyticsFrequency),
    },
    type: {
      type: 'string',
      enum: Object.values(AnalyticsTypes),
    },
    value: {
      anyOf: [
        {
          type: 'string',
        },
        {
          type: 'number',
        },
      ],
    } as any,
    timestamp: {
      type: 'string',
      format: 'date-time',
    },
  },
};

export type StoreAnalytics = {
  [type in AnalyticsTypes]?: any;
};

export interface StoreAnalyticsEntry extends DefaultSchema {
  forStore: string;
  frequency: AnalyticsFrequency;
  type: AnalyticsTypes;
  // The value can be a number or string for now, but we can expand to objects later on
  value: string | number;
  timestamp: string;
}

export const getStoreAnalyticsSdk = (client: Application) => {
  const crudMethods = getCrudMethods<
    OmitServerProperties<StoreAnalytics>,
    StoreAnalytics
  >(client, 'storeAnalytics');

  return {
    ...crudMethods,
    getTypeForStore: (
      storeId: string,
      type: AnalyticsTypes,
      frequency?: AnalyticsFrequency,
      params?: Params
    ) => {
      const options = {};
      merge(options, params, { query: { forStore: storeId, type, frequency } });
      // The ID can be anything here, as it is not used currently
      return crudMethods.get(storeId, options);
    },

    validate: (data: StoreAnalyticsEntry, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },

    AnalyticsTypes,
    AnalyticsFrequency,
    schema,
  };
};
