import { Service } from 'feathers-mongodb';
import { Application } from '@feathersjs/feathers';
import { hooks } from './hooks';

export const storeContents = (app: Application) => {
  const paginate = {
    default: 1,
    max: 5,
  };

  const mongoDb = app.get('mongoDb');
  const options = {
    paginate,
    Model: mongoDb.collection('storeContents'),
    multi: false,
  };

  app.use('/storeContents', new Service(options));
  const service = app.service('storeContents');
  service.hooks(hooks);
};
