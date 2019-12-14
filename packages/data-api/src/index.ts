import setup from './server/server';
import env from './common/env';
import { logger } from './common/logger';

setup().then(app => {
  app.listen(env.SERVER_PORT, () => {
    logger.info(`Server started on port: ${env.SERVER_PORT}`);
  });
});

// TODO: Add SIGTERM and SIGINT to gracefully shutdown. There are libraries that would do this (stoppable is one). Note that `npm` doesn't listen to the signals, so you shouldn't start your process using npm start, but node index.js.
