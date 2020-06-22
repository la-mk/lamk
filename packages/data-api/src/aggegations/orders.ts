import { Db } from 'mongodb';
import { startOfDay, endOfDay } from 'date-fns';
import { sdk } from '@sradevski/la-sdk';
import * as _ from 'lodash';

export const getOrdersCount = (db: Db, storeId: string) =>
  db.collection('orders').count({ orderedFrom: storeId });

export const getDailyOrderCountForStore = (
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
