import { Service } from 'feathers-mongodb';
import { Application } from '@feathersjs/feathers';
import { hooks } from './hooks';

export const carts = (app: Application) => {
  const paginate = {
    default: 10,
    max: 50,
  };

  const mongoDb = app.get('mongoDb');
  const options = {
    paginate,
    Model: mongoDb.collection('carts'),
    multi: false,
  };

  app.use('/carts', new Service(options));
  const service = app.service('carts');
  service.hooks(hooks);
};
