import { Service } from 'feathers-mongodb';
import { Application } from '@feathersjs/feathers';
import { hooks } from './hooks';

export const stores = (app: Application) => {
  const paginate = {
    default: 10,
    max: 50,
  };

  const mongoDb = app.get('mongoDb');
  const options = {
    paginate,
    Model: mongoDb.collection('stores'),
    multi: false,
  };

  app.use('/stores', new Service(options));
  const service = app.service('stores');
  service.hooks(hooks);
};
