import feathers from '@feathersjs/feathers';
import express from '@feathersjs/express';
import socketio from '@feathersjs/socketio';
import { setupSdk } from '@sradevski/la-sdk';
// Currently we only use the SDK for validations and not for doing requests.
// We need to setup the SDK before it is used in the imports.
setupSdk({ apiEndpoint: '' });

import { initLogger, getSyncLogger } from '../common/logger';
import { registerUnhandledErrorHandlers } from '../common/errors';

import { initPreRouteMiddlewares } from './middlewares/preRouteMiddlewares';
import { initPostRouteMiddlewares } from './middlewares/postRouteMiddlewares';

import { registerServices } from './routes/services';
import { registerAppHooks } from './hooks';
import { registerChannels } from './channels/channels';
import { initMongoClient } from './mongo';
import { initScheduler } from '../scheduler';

import env from '../common/env';
import { initErrorMiddlewares } from './middlewares/errorMiddlewares';

export default async () => {
  initLogger({ env: env().NODE_ENV });
  registerUnhandledErrorHandlers(getSyncLogger);

  const app = express(feathers());

  // Set up feathers transports
  app.configure(express.rest());
  app.configure(
    socketio({
      // This is needed if there is a cluster of services running, check https://docs.feathersjs.com/cookbook/general/scaling.html#cluster-configuration.
      // transports: ['websocket']
    }),
  );

  await initPreRouteMiddlewares(app);

  // Initialize database connection
  await initMongoClient(app);

  // Register routes (services) and hooks
  registerAppHooks(app);
  registerServices(app);
  registerChannels(app);

  initPostRouteMiddlewares(app);
  initErrorMiddlewares(app);

  await initScheduler(app);

  return app;
};
