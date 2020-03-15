import * as _ from 'lodash';
import { HookContext } from '@feathersjs/feathers';
import { BadRequest } from '../errors';
import { isProvider, checkContext } from 'feathers-hooks-common';

const isServerCall = isProvider('server');

export const requireAllQueryParams = (params: string[]) => {
  return (ctx: HookContext) => {
    // If it is a server request, ignore the requirement.
    if (isServerCall(ctx)) {
      return;
    }

    const { query = {} } = ctx.params;

    params.forEach(param => {
      if (_.isNil(query[param])) {
        throw new BadRequest(`Missing parameter ${param} while querying`);
      }
    });
  };
};

// This can prevent fetching the entire database data in `find`.
export const requireAnyQueryParam = (params: string[]) => {
  return (ctx: HookContext) => {
    // If it is a server request, ignore the requirement.
    if (isServerCall(ctx)) {
      return;
    }

    const { query = {} } = ctx.params;
    const hasSome = params.some(param => !_.isNil(query[param]));

    if (!hasSome) {
      throw new BadRequest(
        `At least one parameters from "${params.join(
          ', ',
        )}" is required while querying`,
      );
    }
  };
};

// Looks for `isPublished` field in the results, and returns a boolean stating whether the result is published or not.
export const isPublished = () => {
  return (ctx: HookContext) => {
    if (ctx.result) {
      if (ctx.method === 'get') {
        return ctx.result.isPublished === true;
      } else {
        if (ctx.result.total > 0) {
          return !ctx.result.data.filter(
            (entry: any) => entry.isPublished !== true,
          ).length;
        }
      }
    }

    return true;
  };
};

export const patchableFields = (fields: string[]) => {
  return (ctx: HookContext) => {
    checkContext(ctx, 'before', 'patch');
    const dataFields = Object.keys(ctx.data);
    if (dataFields.some(field => !fields.includes(field))) {
      throw new BadRequest(`Some of the fields cannot be patched`);
    }
  };
};
