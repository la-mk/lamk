import { Service } from 'feathers-mongodb';
import { Application } from '@feathersjs/feathers';
import { hooks } from './hooks';

export const users = (app: Application) => {
  const paginate = {
    default: 10,
    max: 50,
  };

  const mongoDb = app.get('mongoDb');
  const options = {
    paginate,
    Model: mongoDb.collection('users'),
    multi: false,
  };

  app.use('/users', new Service(options));
  const service = app.service('users');
  service.hooks(hooks);
};
