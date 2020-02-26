import { Service } from 'feathers-mongodb';
import { Application } from '@feathersjs/feathers';
import { hooks } from './hooks';

export const productGroups = (app: Application) => {
  const paginate = {
    default: 1000,
    max: 9999,
  };

  const mongoDb = app.get('mongoDb');
  const options = {
    paginate,
    Model: mongoDb.collection('productGroups'),
    // This can only be called internally, so allow multi edits.
    multi: true,
  };

  app.use('/productGroups', new Service(options));
  const service = app.service('productGroups');
  service.hooks(hooks);
};
