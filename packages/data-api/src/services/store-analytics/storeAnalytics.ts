import { Application, Params } from '@feathersjs/feathers';
import { Service, MongoDBServiceOptions } from 'feathers-mongodb';
import { hooks } from './hooks';
import { logger } from '../../common/logger';
import { GeneralError } from '../../common/errors';
import { sdk } from '@sradevski/la-sdk';
import { Db } from 'mongodb';
import {
  AnalyticsTypes,
  AnalyticsFrequency,
  StoreAnalytics,
} from '@sradevski/la-sdk/dist/models/storeAnalytics';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { getProductCount } from '../../aggegations/products';
import { getOrdersCount } from '../../aggegations/orders';
import { getTotalRevenue } from '../../aggegations/revenue';

const getAnalyticsTypeQuery = (
  engines: { mongoDb: Db; analyticsModel: Pick<Service, 'get' | 'find'> },
  query: {
    type: AnalyticsTypes;
    forStore: string;
    frequency?: AnalyticsFrequency;
  },
) => {
  switch (query.type) {
    // We want to provide the key metrics in real time.
    case sdk.storeAnalytics.AnalyticsTypes.TOTAL_PRODUCT_COUNT: {
      return () => getProductCount(engines.mongoDb, query.forStore);
    }
    case sdk.storeAnalytics.AnalyticsTypes.TOTAL_ORDER_COUNT: {
      return () => getOrdersCount(engines.mongoDb, query.forStore);
    }
    case sdk.storeAnalytics.AnalyticsTypes.TOTAL_REVENUE: {
      return () => getTotalRevenue(engines.mongoDb, query.forStore);
    }

    default: {
      return async () =>
        ((await engines.analyticsModel.find({
          query: {
            frequency: sdk.storeAnalytics.AnalyticsFrequency.DAILY,
            ...query,
          },
        })) as FindResult<StoreAnalytics>).data;
    }
  }
};

class StoreAnalyticsService extends Service {
  // We want to access the database directly, so we can run aggregation queries
  mongoDb: Db;
  constructor(
    analyticsOptions: { mongoDb: Db },
    adapterOptions: Partial<MongoDBServiceOptions>,
  ) {
    if (!analyticsOptions?.mongoDb) {
      throw new Error(
        'Store analytics service: `options.mongoDb` must be provided',
      );
    }

    super(adapterOptions);
    this.mongoDb = analyticsOptions.mongoDb;
  }

  // We want to use get because the response should be a single object for the specific store.
  // @ts-ignore
  async get(_id: string, params: Params<any>) {
    const { type, frequency } = params.query;
    const query = getAnalyticsTypeQuery(
      {
        mongoDb: this.mongoDb,
        analyticsModel: {
          get: (...args) => super.get(...args),
          find: (...args) => super.find(...args),
        },
      },
      params.query,
    );
    try {
      return await query?.();
    } catch (err) {
      logger.error(
        `Failed to get analytics data for type: ${type}`,
        err.message,
      );
      throw new GeneralError('Failed to get analytics data', {
        type,
        frequency,
      });
    }
  }
}

export const storeAnalytics = (app: Application) => {
  const paginate = {
    default: 100,
    max: 100,
  };

  const mongoDb = app.get('mongoDb');
  const options = {
    paginate,
    Model: mongoDb.collection('storeAnalytics'),
    multi: false,
  };

  const analyticsOptions = {
    mongoDb: app.get('mongoDb'),
  };

  app.use(
    '/storeAnalytics',
    new StoreAnalyticsService(analyticsOptions, options),
  );
  const service = app.service('storeAnalytics');
  service.hooks(hooks);
};
