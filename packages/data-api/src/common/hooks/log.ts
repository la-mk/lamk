import * as _ from 'lodash';
import { logger } from '../logger';
import { HookContext } from '@feathersjs/feathers';
import env from '../env';

const getLogObject = (context: HookContext) => {
  return `
  ${context.type} app.service('${context.path}').${context.method}()

  Params: ${JSON.stringify(context.params.query, null, 2)}, ID: ${context.id}, 
  Data: ${JSON.stringify(_.omit(context.data, 'uri'), null, 2)},
  ${
    context.result
      ? `Result: ${JSON.stringify(_.omit(context.result, 'uri'), null, 2)}`
      : ''
  }
  `;
};

export const log = (context: HookContext) => {
  if (env().NODE_ENV === 'development') {
    logger.info(getLogObject(context));
  }

  if (context.error && !context.result) {
    logger.error(getLogObject(context), context.error.stack);
  }
};
