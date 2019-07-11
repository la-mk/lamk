import * as path from 'path';
import express from '@feathersjs/express';
import { Application } from '@feathersjs/feathers';

export const registerStaticRoutes = (app: Application) => {
  app.use(
    '/images',
    // @ts-ignore Typings are wrong
    express.static(path.join(__dirname, '../../../public/images')),
  );
};
