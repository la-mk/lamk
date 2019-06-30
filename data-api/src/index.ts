import setup from './server/server';
import env from './common/env';
import { logger } from './common/logger';

setup().then(app => {
  app.listen(env.SERVER_PORT, () => {
    logger.info(`Server started on port: ${env.SERVER_PORT}`);
  });
});
