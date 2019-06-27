// @ts-ignore
import * as createService from 'feathers-mongodb';
import { MongoClient } from 'mongodb';
import { Application } from '@feathersjs/feathers';
import { hooks } from './hooks';
import env from '../env';

export const products = async (app: Application<any>) => {
  const paginate = {
    default: 10,
    max: 50,
  };

  const mongoClient = await MongoClient.connect(env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
  });
  const options = {
    paginate,
    Model: mongoClient.db('dev').collection('products'),
  };
  app.use('/products', createService(options));
  const service = app.service('products');
  service.hooks(hooks);
};
