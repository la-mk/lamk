import { logger } from '../logger';
import { HookContext } from '@feathersjs/feathers';

export const log = (context: HookContext) => {
  logger.info(
    `${context.type} app.service('${context.path}').${context.method}()`,
  );

  if (context.error && !context.result) {
    logger.error(context.error.stack);
  }
};
