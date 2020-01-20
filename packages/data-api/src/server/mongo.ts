import { Application } from '@feathersjs/express';
import { MongoClient } from 'mongodb';
import env from '../common/env';
import { logger } from '../common/logger';

export const initMongoClient = async (app: Application) => {
  try {
    logger.info('Connecting to MongoDB');
    const client = await MongoClient.connect(env.MONGODB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      reconnectTries: 10,
      reconnectInterval: 1000,
    });

    logger.info('Connected to MongoDB');
    app.set('mongoClient', client);
    app.set('mongoDb', client.db(env.MONGODB_DB_NAME));
  } catch (err) {
    logger.error('Failed to connect to MongoDB');
    logger.error(err);
  }
};
