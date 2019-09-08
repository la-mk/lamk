import { HookContext } from '@feathersjs/feathers';
import { BadRequest } from '../errors';

export const requireAllQueryParams = (params: string[]) => {
  return (ctx: HookContext) => {
    const { query = {} } = ctx.params;

    params.forEach(param => {
      if (!query[param]) {
        throw new BadRequest(`Missing parameter ${param} while querying`);
      }
    });
  };
};

// This can prevent fetching the entire database data in `find`.
export const requireAnyQueryParam = (params: string[]) => {
  return (ctx: HookContext) => {
    const { query = {} } = ctx.params;
    const hasSome = params.some(param => Boolean(query[param]));
    if (!hasSome) {
      throw new BadRequest(
        `At least one parameters from "${params.join(
          ', ',
        )}" is required while querying`,
      );
    }
  };
};

// Requires either the query to have the owner field, or the result. This is so we avoid an additional call to the DB, but it might change in the future.
export const isOwner = (ownerField: string) => {
  return (ctx: HookContext) => {
    const userEntity = ctx.params['user'];
    // Not authenticated, so not owner for sure.
    if (!userEntity) {
      return false;
    }

    // If getting a single field, look in the resulting data.
    if (ctx.method === 'get') {
      if (ctx.result) {
        return ctx.result[ownerField] === userEntity._id;
      }
      // Otherwise look in the query itself
    } else if (ctx.method === 'find') {
      if (ctx.params.query) {
        return ctx.params.query[ownerField] === userEntity._id;
      }
    }

    return false;
  };
};
