import { Service } from 'feathers-mongodb';
import { Application } from '@feathersjs/feathers';
import { hooks } from './hooks';

export const authManagement = (app: Application) => {
  const paginate = {
    default: 1,
    max: 1,
  };

  const mongoDb = app.get('mongoDb');
  const options = {
    paginate,
    Model: mongoDb.collection('authManagement'),
    multi: true,
  };

  app.use('/authManagement', new Service(options));
  const service = app.service('authManagement');
  service.hooks(hooks);
};
