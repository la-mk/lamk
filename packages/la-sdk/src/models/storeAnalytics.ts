import merge from 'lodash/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';

export enum AnalyticsTypes {
  PRODUCTS_COUNT = 'productsCount',
  ORDERS_COUNT = 'ordersCount',
  REVENUE = 'revenue',
}

export enum AnalyticsFrequency {
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

// We don't need a schema yet, as create/patch are not allowed.
export const schema = {};

export type StoreAnalytics = {
  [type in AnalyticsTypes]?: any 
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
    // We don't need validation yet as create/patch are not allowed.

    AnalyticsTypes,
    AnalyticsFrequency,
  };
};
