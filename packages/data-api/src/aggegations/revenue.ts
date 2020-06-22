import { startOfDay, endOfDay } from 'date-fns';
import { Db } from 'mongodb';
import { sdk } from '@sradevski/la-sdk';
import * as _ from 'lodash';

export const getTotalRevenue = (db: Db, storeId: string) =>
  db
    .collection('orders')
    .aggregate([
      {
        $match: { orderedFrom: storeId },
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
        return { revenue: {} };
      }
      return _.mapValues(_.keyBy(res, '_id'), 'revenue');
    });

export const getDailyRevenueForStore = (
  db: Db,
  storeId: string,
  forDate: Date,
) => {
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
