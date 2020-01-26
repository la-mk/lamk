import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import { unique } from '../../common/hooks/unique';
import {
  queryWithCurrentUser,
  restrictToOwner,
} from 'feathers-authentication-hooks';
import { validate } from '../../common/hooks/db';
import { sdk } from '@sradevski/la-sdk';
import { discard, checkContext } from 'feathers-hooks-common';
import { HookContext } from '@feathersjs/feathers';

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

const createCartForUser = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['create']);
  const user = ctx.result;
  const existingUserCart = await ctx.app.services['carts'].find({
    query: { forUser: user._id },
  });

  if (existingUserCart.total > 0) {
    return;
  }

  await ctx.app.services['carts'].create({ forUser: user._id });
};

const removeCartForUser = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['remove']);

  const user = ctx.result;
  const userCart = await ctx.app.services['carts'].find({
    query: { forUser: user._id },
  });

  if (userCart.total === 0) {
    return;
  }

  await ctx.app.services['carts'].remove(userCart.data[0]._id);
};

export const hooks = {
  before: {
    all: [],
    find: [authenticate('jwt'), queryWithCurrentUser({ as: '_id' })],
    get: [authenticate('jwt'), queryWithCurrentUser({ as: '_id' })],
    create: [
      hashPassword('password'),
      unique(['email']),
      validate(sdk.user.validate),
    ],
    patch: [
      hashPassword('password'),
      authenticate('jwt'),
      restrictToOwner({ ownerField: '_id' }),
      unique(['email']),
      discard('_id'),
      validate(sdk.user.validate),
    ],
    remove: [authenticate('jwt'), restrictToOwner({ ownerField: '_id' })],
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'),
    ],
    find: [],
    get: [],
    create: [createCartForUser],
    patch: [],
    remove: [removeCartForUser],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    patch: [],
    remove: [],
  },
};
