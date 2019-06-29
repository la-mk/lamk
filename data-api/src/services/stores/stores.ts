// @ts-ignore
import * as createService from 'feathers-mongodb';
import { Application } from '@feathersjs/feathers';
import { hooks } from './hooks';

export const stores = (app: Application<any>) => {
  const paginate = {
    default: 10,
    max: 50,
  };

  const mongoDb = app.get('mongoDb');
  const options = {
    paginate,
    Model: mongoDb.collection('stores'),
  };

  app.use('/stores', createService(options));
  const service = app.service('stores');
  service.hooks(hooks);
};
