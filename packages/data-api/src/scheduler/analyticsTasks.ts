import { Application } from '@feathersjs/feathers';
import { Db } from 'mongodb';
import Bluebird from 'bluebird';
import { startOfDay } from 'date-fns';
import { sdk } from '@la-mk/la-sdk';
import { StoreAnalyticsEntry } from '@la-mk/la-sdk/dist/models/storeAnalytics';
import { logger } from '../common/logger';
import { getStoreVisits } from './amplitude';
import { getDailyOrderCountForStore } from '../aggegations/orders';
import { getDailyRevenueForStore } from '../aggegations/revenue';

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
  try {
    const storeIds = await getStoreIds(db);

    const storesOrderCount = await getEntriesForStores(storeIds, storeId =>
      getDailyOrderCountForStore(db, storeId, forDate),
    );

    return createAnalyticsEntries(app, storesOrderCount, startOfDay(forDate), {
      frequency: sdk.storeAnalytics.AnalyticsFrequency.DAILY,
      type: sdk.storeAnalytics.AnalyticsTypes.ORDER_COUNT,
    });
  } catch (err) {
    logger.error(err.message);
  }
};

export const dailyRevenueTask = async (app: Application, forDate: Date) => {
  const db: Db = app.get('mongoDb');
  try {
    const storeIds = await getStoreIds(db);

    const storesRevenue = await getEntriesForStores(storeIds, storeId =>
      getDailyRevenueForStore(db, storeId, forDate),
    );

    return createAnalyticsEntries(app, storesRevenue, startOfDay(forDate), {
      frequency: sdk.storeAnalytics.AnalyticsFrequency.DAILY,
      type: sdk.storeAnalytics.AnalyticsTypes.REVENUE,
    });
  } catch (err) {
    logger.error(err.message);
  }
};

export const dailyStoreVisitTask = async (app: Application, forDate: Date) => {
  const db: Db = app.get('mongoDb');
  try {
    const storeIds = await getStoreIds(db);

    const visitCount = await getStoreVisits(
      storeIds,
      sdk.storeAnalytics.AnalyticsFrequency.DAILY,
      forDate,
      forDate,
    );

    return createAnalyticsEntries(app, visitCount, startOfDay(forDate), {
      frequency: sdk.storeAnalytics.AnalyticsFrequency.DAILY,
      type: sdk.storeAnalytics.AnalyticsTypes.VISIT_COUNT,
    });
  } catch (err) {
    logger.error(err.message);
  }
};
