import * as _ from 'lodash';
import { HookContext, Query } from '@feathersjs/feathers';
import { checkContext, unless, keep, isProvider } from 'feathers-hooks-common';
import { GeneralError } from '../../common/errors';

export const queryWithCurrentUser = (fields: string[]) => {
  return (ctx: HookContext) => {
    checkContext(ctx, 'before', ['get', 'find', 'patch', 'remove']);
    if (fields.length <= 0) {
      throw new GeneralError('You have to query on at least one field');
    }

    // If it was an internal call then skip this hook
    if (!ctx.params.provider) {
      return ctx;
    }

    if (!ctx.params.query) {
      ctx.params.query = {};
    }

    if (fields.length === 1) {
      ctx.params.query[fields[0]] = ctx.params.user._id;
      return;
    }

    fields.map(field => {
      if (!(ctx.params.query as Query).$or) {
        (ctx.params.query as Query).$or = [];
      }

      (ctx.params.query as Query).$or.push({ [field]: ctx.params.user._id });
    });
  };
};

export const setCurrentUser = (fields: string[]) => {
  return (ctx: HookContext) => {
    checkContext(ctx, 'before', ['create', 'patch']);
    if (fields.length <= 0) {
      throw new GeneralError(
        'You have to specify at least one field to set the user to',
      );
    }

    if (!ctx.params.user) {
      throw new GeneralError(
        'You need to ensure the user is authenticated before using setCurrentUser',
      );
    }

    fields.map(field => {
      ctx.data[field] = ctx.params.user._id;
    });
  };
};

// Requires either the query to have the owner field, or the result. This is so we avoid an additional call to the DB, but it might change in the future.
export const isOwner = (ownerFields: string[]) => {
  return (ctx: HookContext) => {
    checkContext(ctx, null, ['find', 'get']);

    const userEntity = ctx.params.user;
    // Not authenticated, so not owner for sure.
    if (!userEntity) {
      return false;
    }

    const data = ctx.method === 'get' ? ctx.result : ctx.result.data[0];

    // There is no data, so it doesn't matter
    if (!data) {
      return false;
    }

    return ownerFields.some(ownerField => data[ownerField] === userEntity._id);
  };
};

// We want to allow the server to access any field, and only limit for non-owners
export const allowFields = (ownerFields: string[], fields: string[]) => {
  return unless(
    (...args) => isOwner(ownerFields)(...args) || isProvider('server')(...args),
    keep(...fields),
  );
};

// We want to allow the server to access any field, and only limit for non-owners
export const setNonOwnerQuery = (
  ownerFields: string[],
  querySet: { [key: string]: number | string | boolean },
) => {
  return unless(
    (...args) => isOwner(ownerFields)(...args) || isProvider('server')(...args),
    (ctx: HookContext) => {
      if (!ctx.params.query) {
        ctx.params.query = {};
      }

      Object.entries(querySet).forEach(([key, val]) => {
        _.set(ctx.params.query as Query, key, val);
      });
    },
  );
};
