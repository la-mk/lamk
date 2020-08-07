import { HookContext } from "@feathersjs/feathers";
import { GeneralError } from "../errors";
import env from '../env';

export const error = (ctx: HookContext) => {
  if (ctx.error) {
    const error = ctx.error;
    
    if (!error.code) {
      const newError = new GeneralError("An error occured.");
      ctx.error = newError;
      return ctx;
    }

    if (error.code === 404 || env().NODE_ENV === 'production') {
      error.stack = null;
    }
    return ctx;
  }
};