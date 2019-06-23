import { logger } from '../../../common/logger';

export const log = (context: any) => {
  logger.info(
    `${context.type} app.service('${context.path}').${context.method}()`,
  );

  if (context.error && !context.result) {
    logger.error(context.error.stack);
  }
};
