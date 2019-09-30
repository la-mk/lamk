import { Service } from 'feathers-mongodb';
import { Application } from '@feathersjs/feathers';
import { hooks } from './hooks';

export const products = (app: Application) => {
  const paginate = {
    default: 10,
    max: 50,
  };

  const mongoDb = app.get('mongoDb');
  const options = {
    paginate,
    Model: mongoDb.collection('products'),
    multi: false,
  };

  app.use('/products', new Service(options));
  const service = app.service('products');
  service.hooks(hooks);
};
