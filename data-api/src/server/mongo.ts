import { MongoClient } from 'mongodb';
import env from '../common/env';
import { Application } from '@feathersjs/express';

export const initMongoClient = async (app: Application) => {
  const client = await MongoClient.connect(env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
  });

  app.set('mongoClient', client);
  app.set('mongoDb', client.db('dev'));
};
