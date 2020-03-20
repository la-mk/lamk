import { Service } from 'feathers-mongodb';
import { Application } from '@feathersjs/feathers';
import { hooks } from './hooks';

export const storePaymentMethods = (app: Application) => {
  const paginate = {
    default: 1,
    max: 50,
  };

  const mongoDb = app.get('mongoDb');
  const options = {
    paginate,
    Model: mongoDb.collection('storePaymentMethods'),
    multi: false,
  };

  app.use('/storePaymentMethods', new Service(options));
  const service = app.service('storePaymentMethods');
  service.hooks(hooks);
};
