import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import { requireAnyQueryParam } from '../../common/hooks/filtering';
import { checkContext } from 'feathers-hooks-common';
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
import { BadRequest } from '../../common/errors';
import {
  setCurrentUser,
  queryWithCurrentUser,
  allowFields,
} from '../../common/hooks/auth';

export interface HookContextWithState<T> extends HookContext {
  beforeState?: T;
}

const assignPreviousProduct = async (ctx: HookContext) => {
  checkContext(ctx, 'before', ['patch']);
  const product = await ctx.app.services['products'].get(ctx.id);
  (ctx as HookContextWithState<Product>).beforeState = product;
};

const calculatePrice = async (ctx: HookContext) => {
  checkContext(ctx, 'before', ['create', 'patch']);
  // If we are creating the object, we are sure the price field is present.
  if (ctx.method === 'create') {
    ctx.data.calculatedPrice = ctx.data.price - (ctx.data.discount ?? 0);
    if (ctx.data.calculatedPrice <= 0) {
      throw new BadRequest('Product has to have a positive price');
    }
    return;
  }

  // If both the price and discount were not updated, there is no need to recalculate price.
  if (!ctx.data.price && ctx.data.discount) {
    return;
  }

  // If we are patching, and we only patch either just price or discount, we won't have all info to calculate the final price.
  const product = await ctx.app.services['products'].get(ctx.id);
  ctx.data.calculatedPrice =
    (ctx.data.price ?? product.price) -
    (ctx.data.discount ?? product.discount ?? 0);

  if (ctx.data.calculatedPrice <= 0) {
    throw new BadRequest('Product has to have a positive price');
  }
};

const allowedFields = [
  '_id',
  'name',
  'unit',
  'price',
  'discount',
  'calculatedPrice',
  'category',
  'images',
  'description',
  'soldBy',
  'sku',
  'stock',
];

const numberFieldsSet = new Set(['price', 'discount', 'calculatedPrice']);

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
      setCurrentUser(['soldBy']),
      removeDuplicates('groups'),
      calculatePrice,
      validate(sdk.product.validate),
    ],
    patch: [
      authenticate('jwt'),
      queryWithCurrentUser(['soldBy']),
      assignPreviousProduct,
      removeDuplicates('groups'),
      calculatePrice,
      validate(sdk.product.validate),
    ],
    remove: [authenticate('jwt'), queryWithCurrentUser(['soldBy'])],
  },

  after: {
    all: [],
    find: [allowFields(['soldBy'], allowedFields)],
    get: [allowFields(['soldBy'], allowedFields)],
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
};
