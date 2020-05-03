import merge from 'lodash/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import v8n from 'v8n';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';

export enum AnalyticsTypes {
  TOTAL_PRODUCT_COUNT = 'totalProductCount',
  TOTAL_ORDER_COUNT = 'totalOrderCount',
  TOTAL_REVENUE = 'totalRevenue',

  ORDER_COUNT="orderCount",
  REVENUE = 'revenue',
}

export enum AnalyticsFrequency {
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

// We don't need a schema yet, as create/patch are not allowed.
export const schema = {
 ...defaultSchemaEntries,
  forStore: v8n().id(),
  frequency: v8n().oneOf(Object.values(AnalyticsFrequency)),
  type: v8n().oneOf(Object.values(AnalyticsTypes)),
  // The value can be any, either a number or an object with numbers.
  value: v8n().not.null(),
  timestamp: v8n().datetime(),
};

export type StoreAnalytics = {
  [type in AnalyticsTypes]?: any 
}

export interface StoreAnalyticsEntry extends DefaultSchema {
  forStore: string;
  frequency: AnalyticsFrequency;
  type: AnalyticsTypes;
  // The value can be a number of an object, depending on the type.
  value: any;
  timestamp: string;
}

export const getStoreAnalyticsSdk = (client: Application) => {
  const crudMethods = getCrudMethods<
    OmitServerProperties<StoreAnalytics>,
    StoreAnalytics
  >(client, 'storeAnalytics');

  return {
    ...crudMethods,
    getTypeForStore: (storeId: string, type: AnalyticsTypes, frequency?: AnalyticsFrequency,  params?: Params) => {
      const options = {};
      merge(options, params, { query:  { forStore: storeId, type, frequency } } );
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
  };
};
