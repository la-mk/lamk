import feathers from '@feathersjs/feathers';
import express from '@feathersjs/express';
import socketio from '@feathersjs/socketio';
import { setupSdk } from '@sradevski/la-sdk';
import env from '../common/env';

// Currently we only use the SDK for validations and not for doing requests.
// We need to setup the SDK before it is used in the imports.
setupSdk({
  apiEndpoint: '',
  imagesEndpoint: env().ARTIFACTS_ENDPOINT,
  imagesProxyEndpoint: env().IMAGES_PROXY_ENDPOINT,
});

import { initLogger, getSyncLogger } from '../common/logger';
import { registerUnhandledErrorHandlers } from '../common/errors';

import { initPreRouteMiddlewares } from './middlewares/preRouteMiddlewares';
import { initPostRouteMiddlewares } from './middlewares/postRouteMiddlewares';

import { registerServices } from './routes/services';
import { registerAppHooks } from './hooks';
import { registerChannels } from './channels/channels';
import { initMongoClient } from './mongo';
import { initScheduler } from '../scheduler';
import { initI18n } from '../common/i18n';

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
  await initI18n();

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
