import { Service } from 'feathers-mongodb';
import { Application } from '@feathersjs/feathers';
import { hooks } from './hooks';

export const deliveries = (app: Application) => {
  const paginate = {
    default: 50,
    max: 50,
  };

  const mongoDb = app.get('mongoDb');
  const options = {
    paginate,
    Model: mongoDb.collection('deliveries'),
    multi: false,
  };

  app.use('/deliveries', new Service(options));
  const service = app.service('deliveries');
  service.hooks(hooks);
};
