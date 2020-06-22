import { Db } from 'mongodb';

export const getProductCount = (db: Db, storeId: string) =>
  db.collection('products').count({ soldBy: storeId });
