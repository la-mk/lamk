import { logger } from '../logger';
import { HookContext } from '@feathersjs/feathers';
import env from '../env';

export const log = (context: HookContext) => {
  if (env.NODE_ENV === 'development') {
    logger.info(
      `${context.type} app.service('${context.path}').${context.method}()`,
    );

    logger.info(
      `
      Params: ${JSON.stringify(context.params.query, null, 2)}, ID: ${
        context.id
      }, 
      Data: ${JSON.stringify(context.data, null, 2)}, 
      Result: ${JSON.stringify(context.result, null, 2)}`,
    );
  }

  if (context.error && !context.result) {
    logger.error(context.error.stack);
  }
};
