import { Service } from 'feathers-mongodb';
import { Application } from '@feathersjs/feathers';
import { hooks } from './hooks';

export const categoriesPerStore = (app: Application) => {
  const paginate = {
    default: 10,
    max: 99999,
  };

  const mongoDb = app.get('mongoDb');
  const options = {
    paginate,
    Model: mongoDb.collection('categoriesPerStore'),
    // This can only be called internally, so allow multi edits.
    multi: true,
  };

  app.use('/categoriesPerStore', new Service(options));
  const service = app.service('categoriesPerStore');
  service.hooks(hooks);
};
