import { startOfDay, endOfDay } from 'date-fns';
import { Db } from 'mongodb';
import { sdk } from '@la-mk/la-sdk';

export const getTotalRevenue = (db: Db, storeId: string) =>
  db
    .collection('orders')
    .aggregate([
      {
        $match: {
          orderedFrom: storeId,
          status: {
            $nin: [
              sdk.order.OrderStatus.CANCELLED,
              sdk.order.OrderStatus.INVALID,
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$calculatedTotal' },
        },
      },
    ])
    .toArray()
    .then(res => {
      return res.length > 0 ? res[0].revenue : 0;
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
          status: {
            $nin: [
              sdk.order.OrderStatus.CANCELLED,
              sdk.order.OrderStatus.INVALID,
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$calculatedTotal' },
        },
      },
    ])
    .toArray()
    .then(res => {
      return res.length > 0 ? res[0].revenue : 0;
    });
};
