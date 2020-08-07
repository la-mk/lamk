import setup from './server/server';
import env from './common/env';
import { logger } from './common/logger';
import { createTerminus } from '@godaddy/terminus';
import { Application } from '@feathersjs/express';

const onSignal = async (app: Application) => {
  logger.info('server is starting cleanup...');
  logger.info('Stopping scheduler...');
  await app.get('scheduler')?.stop?.();
  logger.info('Closing database...');
  await app.get('mongoClient')?.close?.();
  logger.info('Cleanup done');
};

const onShutdown = () => {
  logger.info('Cleanup finished, server is shutting down...');
  return Promise.resolve();
};

const healthCheck = async (app: Application) => {
  try {
    return await app.get('mongoDb').command({ ping: 1 });
  } catch (err) {
    return;
  }
};

setup().then(app => {
  logger.info(`Starting server...`);
  const server = app.listen(env().PORT, () => {
    logger.info(`Server started on port: ${env().PORT}`);
  });

  createTerminus(server, {
    healthChecks: {
      '/healthcheck': () => healthCheck(app),
      verbatim: true,
    },
    onSignal: () => onSignal(app),
    onShutdown,
  });
});
