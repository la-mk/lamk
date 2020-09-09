import { HookContext } from '@feathersjs/feathers';
import { GeneralError } from '../errors';
import env from '../env';

export const error = (ctx: HookContext) => {
  if (ctx.error) {
    if (!ctx.error.code) {
      const newError = new GeneralError('An error occured.');
      ctx.error = newError;
      return ctx;
    }

    if (ctx.error.code === 404 || env().NODE_ENV === 'production') {
      ctx.error.stack = null;
    }

    return ctx;
  }
};
