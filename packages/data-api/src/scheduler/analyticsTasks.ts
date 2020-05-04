import * as _ from 'lodash';
import { Application } from '@feathersjs/feathers';
import { Db } from 'mongodb';
import Bluebird from 'bluebird';
import { startOfDay, endOfDay } from 'date-fns';
import { sdk } from '@sradevski/la-sdk';
import { StoreAnalyticsEntry } from '@sradevski/la-sdk/dist/models/storeAnalytics';

const getDailyRevenueForStore = (db: Db, storeId: string, forDate: Date) => {
  const fromDatetime = startOfDay(forDate).toISOString();
  const toDatetime = endOfDay(forDate).toISOString();

  return db
    .collection('orders')
    .aggregate([
      {
        $match: {
          orderedFrom: storeId,
          createdAt: { $gte: fromDatetime, $lte: toDatetime },
        },
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
        return { [sdk.storeAnalytics.AnalyticsTypes.REVENUE]: {} };
      }
      return _.mapValues(_.keyBy(res, '_id'), 'revenue');
    });
};

const getDailyOrderCountForStore = (db: Db, storeId: string, forDate: Date) => {
  const fromDatetime = startOfDay(forDate).toISOString();
  const toDatetime = endOfDay(forDate).toISOString();

  return db
    .collection('orders')
    .aggregate([
      {
        $match: {
          orderedFrom: storeId,
          createdAt: { $gte: fromDatetime, $lte: toDatetime },
        },
      },
      {
        $group: { _id: '$status', orderCount: { $sum: 1 } },
      },
    ])
    .toArray()
    .then(res => {
      if (res.length <= 0) {
        return { [sdk.storeAnalytics.AnalyticsTypes.ORDER_COUNT]: {} };
      }
      return _.mapValues(_.keyBy(res, '_id'), 'orderCount');
    });
};

const getStoreIds = (db: Db): Promise<string[]> =>
  db.collection('stores').distinct('_id');

const createAnalyticsEntries = (
  app: Application,
  entries: Array<{ forStore: string; value: any }>,
  timestamp: Date,
  entriesData: Partial<StoreAnalyticsEntry>,
) => {
  return Bluebird.map(
    entries,
    async entry => {
      const newData = {
        forStore: entry.forStore,
        value: entry.value,
        timestamp: timestamp.toISOString(),
        ...entriesData,
      };

      const existingData = (
        await app.service('storeAnalytics').find({
          query: {
            forStore: newData.forStore,
            timestamp: newData.timestamp,
            frequency: newData.frequency,
            type: newData.type,
          },
        })
      ).data[0];

      if (existingData) {
        return app.service('storeAnalytics').patch(existingData._id, newData);
      }

      return app.service('storeAnalytics').create(newData);
    },
    { concurrency: 20 },
  );
};

const getEntriesForStores = async <T extends any>(
  storeIds: string[],
  fetcher: (storeId: string) => Promise<T>,
) => {
  return Bluebird.map(
    storeIds,
    async storeId => ({
      forStore: storeId,
      value: await fetcher(storeId),
    }),
    {
      concurrency: 20,
    },
  );
};

export const dailyOrderCountTask = async (app: Application, forDate: Date) => {
  const db: Db = app.get('mongoDb');
  const storeIds = await getStoreIds(db);

  const storesOrderCount = await getEntriesForStores(storeIds, storeId =>
    getDailyOrderCountForStore(db, storeId, forDate),
  );

  return createAnalyticsEntries(app, storesOrderCount, startOfDay(forDate), {
    frequency: sdk.storeAnalytics.AnalyticsFrequency.DAILY,
    type: sdk.storeAnalytics.AnalyticsTypes.ORDER_COUNT,
  });
};

export const dailyRevenueTask = async (app: Application, forDate: Date) => {
  const db: Db = app.get('mongoDb');
  const storeIds = await getStoreIds(db);

  const storesRevenue = await getEntriesForStores(storeIds, storeId =>
    getDailyRevenueForStore(db, storeId, forDate),
  );

  return createAnalyticsEntries(app, storesRevenue, startOfDay(forDate), {
    frequency: sdk.storeAnalytics.AnalyticsFrequency.DAILY,
    type: sdk.storeAnalytics.AnalyticsTypes.REVENUE,
  });
};
