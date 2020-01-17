import { Service } from 'feathers-mongodb';
import { Application } from '@feathersjs/feathers';
import { hooks } from './hooks';

export const addresses = (app: Application) => {
  const paginate = {
    default: 50,
    max: 50,
  };

  const mongoDb = app.get('mongoDb');
  const options = {
    paginate,
    Model: mongoDb.collection('addresses'),
    multi: false,
  };

  app.use('/addresses', new Service(options));
  const service = app.service('addresses');
  service.hooks(hooks);
};
