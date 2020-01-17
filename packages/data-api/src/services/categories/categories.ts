import { Service } from 'feathers-mongodb';
import { Application } from '@feathersjs/feathers';
import { hooks } from './hooks';

export const categories = (app: Application) => {
  const paginate = {
    default: 1000,
    max: 99999,
  };

  const mongoDb = app.get('mongoDb');
  const options = {
    paginate,
    Model: mongoDb.collection('categories'),
    multi: false,
  };

  app.use('/categories', new Service(options));
  const service = app.service('categories');
  service.hooks(hooks);
};
