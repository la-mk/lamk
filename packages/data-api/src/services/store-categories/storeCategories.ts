import { Service } from 'feathers-mongodb';
import { Application } from '@feathersjs/feathers';
import { hooks } from './hooks';

export const storeCategories = (app: Application) => {
  const paginate = {
    default: 1000,
    max: 9999,
  };

  const mongoDb = app.get('mongoDb');
  const options = {
    paginate,
    Model: mongoDb.collection('storeCategories'),
    // This can only be called internally, so allow multi edits.
    multi: true,
  };

  app.use('/storeCategories', new Service(options));
  const service = app.service('storeCategories');
  service.hooks(hooks);
};
