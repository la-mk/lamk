import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import {
  requireAnyQueryParam,
  isPublished,
} from '../../common/hooks/filtering';
import { unless, disallow } from 'feathers-hooks-common';
import { NotFound } from '../../common/errors';
import { sdk } from '@la-mk/la-sdk';
import { validate, unique } from '../../common/hooks/db';
import {
  createStoreContentsIfNotExists,
  removeStoreContents,
} from './serviceHooks/storeContents';
import {
  setCurrentUser,
  queryWithCurrentUser,
  allowFields,
  isOwner,
} from '../../common/hooks/auth';
import {
  createStorePaymentMethodsIfNotExists,
  removeStorePaymentMethods,
} from './serviceHooks/storePaymentMethods';
import loadEnv from '../../common/env';
import { HookContext } from '@feathersjs/feathers';

const allowedFields = [
  '_id',
  'name',
  'slug',
  'customDomain',
  'logo',
  'color',
  'slogan',
  'isPublished',
  'ownedBy',
  'contact',
  'company',
];

const transform = async (ctx: HookContext) => {
  if (ctx.data?.slug) {
    ctx.data.slug = ctx.data.slug.toLowerCase();
  }
};

export const hooks = {
  before: {
    all: [],
    find: [requireAnyQueryParam(['ownedBy', 'slug', 'customDomain'])],
    get: [],
    create: [
      ...(loadEnv().ENABLE_SIGNUP ? [] : [disallow('external')]),
      // We currently don't allow registrations while we are in alpha.
      // disallow('external'),
      authenticate('jwt'),
      // For a start, we want to have 1:1 mapping between user and store and use the same ID to simplify usage.
      setCurrentUser(['_id', 'ownedBy']),
      transform,
      validate(sdk.store.validate),
      // Since we set the same ID as the user, double-check that the ID is unique.
      unique(['_id']),
    ],
    patch: [
      authenticate('jwt'),
      queryWithCurrentUser(['ownedBy']),
      transform,
      validate(sdk.store.validate),
    ],
    remove: [authenticate('jwt'), queryWithCurrentUser(['ownedBy'])],
  },

  after: {
    all: [],
    find: [
      unless(
        isOwner(['ownedBy']),
        unless(isPublished(), () => {
          throw new NotFound('Store not found');
        }),
      ),
      allowFields(['ownedBy'], allowedFields),
    ],
    get: [
      unless(
        isOwner(['ownedBy']),
        unless(isPublished(), () => {
          throw new NotFound('Store not found');
        }),
      ),
      allowFields(['ownedBy'], allowedFields),
    ],
    create: [
      createStoreContentsIfNotExists,
      createStorePaymentMethodsIfNotExists,
    ],
    patch: [],
    remove: [removeStoreContents, removeStorePaymentMethods],
  },
};
