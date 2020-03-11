import { Service } from 'feathers-mongodb';
import { Application } from '@feathersjs/feathers';
import { hooks } from './hooks';

export const campaigns = (app: Application) => {
  const paginate = {
    default: 50,
    max: 50,
  };

  const mongoDb = app.get('mongoDb');
  const options = {
    paginate,
    Model: mongoDb.collection('campaigns'),
    multi: false,
  };

  app.use('/campaigns', new Service(options));
  const service = app.service('campaigns');
  service.hooks(hooks);
};
