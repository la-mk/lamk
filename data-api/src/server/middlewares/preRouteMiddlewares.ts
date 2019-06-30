import express, { Application } from '@feathersjs/express';
import * as compress from 'compression';
import * as helmet from 'helmet';
import * as cors from 'cors';

export const initPreRouteMiddlewares = (app: Application) => {
  // Handle all of these by a reverse proxy.
  app.use(helmet());
  app.use(cors());
  app.use(compress());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};
