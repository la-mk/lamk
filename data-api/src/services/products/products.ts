// @ts-ignore
import * as createService from 'feathers-mongodb';
import { Application } from '@feathersjs/feathers';
import { hooks } from './hooks';

export const products = (app: Application<any>) => {
  const paginate = {
    default: 10,
    max: 50,
  };

  const mongoDb = app.get('mongoDb');
  const options = {
    paginate,
    Model: mongoDb.collection('products'),
  };

  app.use('/products', createService(options));
  const service = app.service('products');
  service.hooks(hooks);
};
