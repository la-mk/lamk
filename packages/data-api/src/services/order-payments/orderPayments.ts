import { Service } from 'feathers-mongodb';
import { Application } from '@feathersjs/feathers';
import { hooks } from './hooks';

export const orderPayments = (app: Application) => {
  const paginate = {
    default: 10,
    max: 50,
  };

  const mongoDb = app.get('mongoDb');
  const options = {
    paginate,
    Model: mongoDb.collection('orderPayments'),
    multi: false,
  };

  app.use('/orderPayments', new Service(options));
  const service = app.service('orderPayments');
  service.hooks(hooks);
};
