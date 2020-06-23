import { Db } from 'mongodb';
import { startOfDay, endOfDay } from 'date-fns';

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
        $count: 'orderCount',
      },
    ])
    .toArray()
    .then(res => {
      return res.length > 0 ? res[0].orderCount : 0;
    });
};
