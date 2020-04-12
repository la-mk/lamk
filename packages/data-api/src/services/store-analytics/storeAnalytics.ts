import * as _ from 'lodash';
import { Application, Params } from '@feathersjs/feathers';
import { Service, MongoDBServiceOptions } from 'feathers-mongodb';
import { hooks } from './hooks';
import { logger } from '../../common/logger';
import { GeneralError } from '../../common/errors';
import { sdk } from '@sradevski/la-sdk';
import { Db } from 'mongodb';
import { AnalyticsTypes } from '@sradevski/la-sdk/dist/models/storeAnalytics';

interface SearchData {
  model: string;
  item: any;
}

const getAnalyticsTypeQuery = (
  type: AnalyticsTypes,
  forStore: string,
  engines: { mongoDb: Db },
  // _frequency?: AnalyticsFrequency,
) => {
  switch (type) {
    case sdk.storeAnalytics.AnalyticsTypes.PRODUCTS_COUNT: {
      return () =>
        engines.mongoDb.collection('products').count({ soldBy: forStore });
    }
    case sdk.storeAnalytics.AnalyticsTypes.ORDERS_COUNT: {
      return () =>
        engines.mongoDb.collection('orders').count({ orderedFrom: forStore });
    }

    case sdk.storeAnalytics.AnalyticsTypes.REVENUE: {
      return () =>
        engines.mongoDb
          .collection('orders')
          .aggregate([
            {
              $match: { orderedFrom: forStore },
            },
            {
              $group: {
                _id: '$status',
                revenue: { $sum: '$calculatedTotal' },
              },
            },
          ])
          .toArray()
          .then(res => {
            if (res.length <= 0) {
              return {};
            }
            return _.mapValues(_.keyBy(res, '_id'), 'revenue');
          });
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
      throw new Error('Search service: `options.mongoDb` must be provided');
    }

    super(adapterOptions);
    this.mongoDb = analyticsOptions.mongoDb;
  }

  // We want to use get because the response should be a single object for the specific store.
  // @ts-ignore
  async get(_id: string, params: Params<any>) {
    const { type, forStore, frequency } = params.query;
    const query = getAnalyticsTypeQuery(type, forStore, {
      mongoDb: this.mongoDb,
    });

    try {
      return await query();
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
    Model: mongoDb.collection('storeContents'),
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
