import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import {
  restrictToOwner,
  associateCurrentUser,
} from 'feathers-authentication-hooks';
import { unique } from '../../common/hooks/unique';
import {
  requireAnyQueryParam,
  isOwner,
  isPublished,
} from '../../common/hooks/filtering';
import { unless, keep, checkContext, discard } from 'feathers-hooks-common';
import { NotFound } from '../../common/errors';
import { sdk } from '@sradevski/la-sdk';
import { validate } from '../../common/hooks/db';
import { HookContext } from '@feathersjs/feathers';

const createStoreContentsIfNotExists = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['create']);
  const store = ctx.result;
  const existingStoreContents = await ctx.app.services['storeContents'].find({
    query: { forStore: store._id },
  });

  if (existingStoreContents.total > 0) {
    return;
  }

  await ctx.app.services['storeContents'].create({ forStore: store._id });
};

const removeStoreContents = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['remove']);
  const store = ctx.result;

  const storeContents = await ctx.app.services['storeContents'].find({
    query: { forStore: store._id },
  });

  if (storeContents.total === 0) {
    return;
  }

  await ctx.app.services['storeContents'].remove(storeContents.data[0]._id);
};

export const hooks = {
  before: {
    all: [],
    find: [requireAnyQueryParam(['ownedBy', 'slug', 'customDomain'])],
    get: [],
    create: [
      authenticate('jwt'),
      associateCurrentUser({ as: 'ownedBy' }),
      // For a start, we want to have 1:1 mapping between user and store and use the same ID to simplify usage.
      associateCurrentUser({ as: '_id' }),
      // Since we set the same ID as the user, double-check that the ID is unique.
      unique(['_id']),
      validate(sdk.store.validate),
    ],
    patch: [
      authenticate('jwt'),
      restrictToOwner({ ownerField: 'ownedBy' }),
      discard('_id'),
      validate(sdk.store.validate),
    ],
    remove: [authenticate('jwt'), restrictToOwner({ ownerField: 'ownedBy' })],
  },

  after: {
    all: [],
    find: [
      unless(
        isOwner('ownedBy'),
        unless(isPublished(), () => {
          throw new NotFound('Store not found');
        }),
      ),
      unless(
        isOwner('ownedBy'),
        keep(
          '_id',
          'name',
          'slug',
          'customDomain',
          'logo',
          'isPublished',
          'ownedBy',
        ),
      ),
    ],
    get: [
      unless(
        isOwner('ownedBy'),
        unless(isPublished(), () => {
          throw new NotFound('Store not found');
        }),
      ),
      unless(
        isOwner('ownedBy'),
        keep(
          '_id',
          'name',
          'slug',
          'customDomain',
          'logo',
          'isPublished',
          'ownedBy',
        ),
      ),
    ],
    create: [createStoreContentsIfNotExists],
    patch: [],
    remove: [removeStoreContents],
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
