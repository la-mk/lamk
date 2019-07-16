import { Service } from 'feathers-mongodb';
import { Application } from '@feathersjs/feathers';
import { hooks } from './hooks';

export const orders = (app: Application) => {
  const paginate = {
    default: 10,
    max: 50,
  };

  const mongoDb = app.get('mongoDb');
  const options = {
    paginate,
    Model: mongoDb.collection('orders'),
    multi: false,
  };

  app.use('/orders', new Service(options));
  const service = app.service('orders');
  service.hooks(hooks);
};
