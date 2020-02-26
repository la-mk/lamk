import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import {
  restrictToOwner,
  associateCurrentUser,
} from 'feathers-authentication-hooks';
import { requireAnyQueryParam, isOwner } from '../../common/hooks/filtering';
import {
  unless,
  keep,
  checkContext,
  discard,
  isProvider,
} from 'feathers-hooks-common';
import { HookContext } from '@feathersjs/feathers';
import { sdk } from '@sradevski/la-sdk';
import {
  validate,
  convertQueryToNumber,
  removeDuplicates,
} from '../../common/hooks/db';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import {
  createProductSearch,
  patchProductSearch,
  removeProductSearch,
} from './serviceHooks/search';
import {
  createCategoriesPerStore,
  patchCategoriesPerStore,
  removeCategoriesPerStore,
} from './serviceHooks/categoriesPerStore';
import {
  removeProductGroups,
  patchProductGroups,
  createProductGroups,
} from './serviceHooks/productGroups';

export interface HookContextWithState<T> extends HookContext {
  beforeState?: T;
}

const assignPreviousProduct = async (ctx: HookContext) => {
  checkContext(ctx, 'before', ['patch']);
  const product = await ctx.app.services['products'].get(ctx.id);
  (ctx as HookContextWithState<Product>).beforeState = product;
};

const numberFieldsSet = new Set(['price']);

export const hooks = {
  before: {
    all: [],
    find: [
      requireAnyQueryParam(['_id', 'soldBy']),
      convertQueryToNumber(numberFieldsSet),
    ],
    get: [],
    create: [
      authenticate('jwt'),
      associateCurrentUser({ as: 'soldBy' }),
      removeDuplicates('groups'),
      validate(sdk.product.validate),
    ],
    patch: [
      authenticate('jwt'),
      restrictToOwner({ ownerField: 'soldBy' }),
      assignPreviousProduct,
      discard('_id'),
      removeDuplicates('groups'),
      validate(sdk.product.validate),
    ],
    remove: [authenticate('jwt'), restrictToOwner({ ownerField: 'soldBy' })],
  },

  after: {
    all: [],
    find: [
      unless(
        (...args) =>
          isOwner('soldBy')(...args) || isProvider('server')(...args),
        keep(
          '_id',
          'name',
          'price',
          'unit',
          'category',
          'images',
          'description',
          'soldBy',
          'sku',
          'stock',
        ),
      ),
    ],
    get: [
      unless(
        (...args) =>
          isOwner('soldBy')(...args) || isProvider('server')(...args),
        keep(
          '_id',
          'name',
          'price',
          'unit',
          'category',
          'images',
          'description',
          'soldBy',
          'sku',
          'stock',
        ),
      ),
    ],
    create: [
      createProductSearch,
      createCategoriesPerStore,
      createProductGroups,
    ],
    patch: [patchProductSearch, patchCategoriesPerStore, patchProductGroups],
    remove: [
      removeProductSearch,
      removeCategoriesPerStore,
      removeProductGroups,
    ],
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
