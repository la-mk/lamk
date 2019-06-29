import feathers from '@feathersjs/feathers';
import express from '@feathersjs/express';
import socketio from '@feathersjs/socketio';
import * as compress from 'compression';
import * as helmet from 'helmet';
import * as cors from 'cors';

import { logger, registerLogger, getSyncLogger } from '../common/logger';
import { initMongoClient } from '../common/mongoClient';
import { registerUnhandledErrorHandlers } from '../common/unhandledErrorHandlers';
import { registerServices } from './routes/services';
import { registerAppHooks } from './hooks/app';
import { registerChannels } from './channels/channels';
import env from './env';

export default async () => {
  registerLogger({ env: env.NODE_ENV });
  registerUnhandledErrorHandlers(getSyncLogger);

  const app = express(feathers());

  // Handle all of these by a reverse proxy.
  app.use(helmet());
  app.use(cors());
  app.use(compress());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.configure(express.rest());
  app.configure(socketio());

  await initMongoClient(app);
  registerAppHooks(app);
  registerServices(app);
  registerChannels(app);
  // Configure a middleware for error handler
  app.use(express.errorHandler({ logger }));
  return app;
};
