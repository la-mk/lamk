import { Service } from 'feathers-mongodb';
import { Application } from '@feathersjs/feathers';
import { hooks } from './hooks';

export const contactUs = (app: Application) => {
  const paginate = {
    default: 50,
    max: 50,
  };

  const mongoDb = app.get('mongoDb');
  const options = {
    paginate,
    Model: mongoDb.collection('contactUs'),
    multi: false,
  };

  app.use('/contactUs', new Service(options));
  const service = app.service('contactUs');
  service.hooks(hooks);
};
