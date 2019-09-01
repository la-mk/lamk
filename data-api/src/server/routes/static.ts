import * as path from 'path';
import { original as express } from '@feathersjs/express';
import { Application } from '@feathersjs/feathers';

export const registerStaticRoutes = (app: Application) => {
  app.use(
    '/images',
    express.static(path.join(__dirname, '../../../public/images')),
  );
};
