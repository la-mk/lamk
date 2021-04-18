import { Service } from 'feathers-mongodb';
import { Application } from '@feathersjs/feathers';
import { hooks } from './hooks';

export const storeIntegrations = (app: Application) => {
  const paginate = {
    default: 1,
    max: 1,
  };

  const mongoDb = app.get('mongoDb');
  const options = {
    paginate,
    Model: mongoDb.collection('storeIntegrations'),
    multi: false,
  };

  app.use('/storeIntegrations', new Service(options));
  const service = app.service('storeIntegrations');
  service.hooks(hooks);
};
