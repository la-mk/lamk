import * as _ from 'lodash';
import { logger } from '../logger';
import { HookContext } from '@feathersjs/feathers';
import env from '../env';

const getLogObject = (context: HookContext) => {
  return `
  ${context.type} app.service('${context.path}').${context.method}()
  Params: ${JSON.stringify(context.params.query)}, ID: ${context.id}, 
  Data: ${JSON.stringify(_.omit(context.data, 'uri'))},
  ${
    context.result
      ? `Result: ${JSON.stringify(_.omit(context.result, 'uri')).slice(0, 100)}`
      : ''
  },
  ${
    context.error
      ? `Error: ${context.error.stack || context.error.message}`
      : ''
  }
  `;
};

export const log = (context: HookContext) => {
  if (env().NODE_ENV === 'development') {
    if (context.error) {
      logger.error(getLogObject(context));
    } else {
      logger.info(getLogObject(context));
    }
  } else if (context.error && !context.result) {
    logger.error(getLogObject(context));
  }
};
