import setup from './server/server';
import { logger } from './common/logger';
import env from './server/env';

setup().then(app => {
  app.listen(env.SERVER_PORT, () => {
    logger.info(`Server started on port: ${env.SERVER_PORT}`);
  });
});
