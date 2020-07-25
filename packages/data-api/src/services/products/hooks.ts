import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import { requireAnyQueryParam, pickFields } from '../../common/hooks/filtering';
import { checkContext } from 'feathers-hooks-common';
import { HookContext } from '@feathersjs/feathers';
import { sdk } from '@sradevski/la-sdk';
import {
  validate,
  convertQueryToNumber,
  removeDuplicates,
} from '../../common/hooks/db';
import { Product, Variant } from '@sradevski/la-sdk/dist/models/product';
import {
  createProductSearch,
  patchProductSearch,
  removeProductSearch,
} from './serviceHooks/search';
import {
  createStoreCategories,
  patchStoreCategories,
  removeStoreCategories,
} from './serviceHooks/storeCategories';
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
import { HookContextWithState } from '../../common/types';

const assignPreviousProduct = async (ctx: HookContext) => {
  checkContext(ctx, 'before', ['patch']);
  const product = await ctx.app.services['products'].get(ctx.id);
  (ctx as HookContextWithState<Product>).contextState = product;
};

const calculateFields = async (ctx: HookContext) => {
  checkContext(ctx, 'before', ['create', 'patch']);
  // If patching one variant, you'll need to pass all of them, otherwise it's difficult to know what changed. We can change it to be able ot pass a single full variantt, so we can match it with what is in the DB, but it's not necessary for now.
  const variants = ctx.data.variants ?? [];

  variants.forEach((variant: Variant) => {
    variant.calculatedPrice = sdk.utils.pricing.calculateProductPrice(variant);

    if (variant.calculatedPrice <= 0) {
      throw new BadRequest('Product variant has to have a positive price');
    }

    ctx.data.totalStock =
      variant.stock != null
        ? (ctx.data.totalStock ?? 0) + variant.stock
        : ctx.data.totalStock;

    ctx.data.minPrice = Math.min(
      ctx.data.minPrice ?? Number.POSITIVE_INFINITY,
      variant.price,
    );

    ctx.data.maxPrice = Math.max(
      ctx.data.maxPrice ?? Number.NEGATIVE_INFINITY,
      variant.price,
    );

    ctx.data.minDiscount =
      variant.discount != null
        ? Math.min(
            ctx.data.minDiscount ?? Number.POSITIVE_INFINITY,
            variant.discount,
          )
        : ctx.data.minDiscount;

    ctx.data.maxDiscount =
      variant.discount != null
        ? Math.max(
            ctx.data.maxDiscount ?? Number.NEGATIVE_INFINITY,
            variant.discount,
          )
        : ctx.data.maxDiscount;

    ctx.data.minCalculatedPrice = Math.min(
      ctx.data.minCalculatedPrice ?? Number.POSITIVE_INFINITY,
      variant.calculatedPrice,
    );

    ctx.data.maxCalculatedPrice = Math.max(
      ctx.data.maxCalculatedPrice ?? Number.NEGATIVE_INFINITY,
      variant.calculatedPrice,
    );
  });
};

const allowSetFields = [
  '_id',
  'soldBy',
  'name',
  'unit',
  'category',
  'images',
  'groups',
  'description',
  'variants',
  'createdAt',
  'modifiedAt',
];

const allowedFields = [
  '_id',
  'name',
  'unit',
  'category',
  'images',
  'description',
  'soldBy',
  'variants',
  'totalStock',
  'minPrice',
  'maxPrice',
  'minDiscount',
  'maxDiscount',
  'minCalculatedPrice',
  'maxCalculatedPrice',
  'createdAt',
];

const numberFieldsSet = new Set([
  'minPrice',
  'maxPrice',
  'minDiscount',
  'maxDiscount',
  'minCalculatedPrice',
  'maxCalculatedPrice',
  'totalStock',
]);

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
      pickFields(allowSetFields),
      removeDuplicates('groups'),
      calculateFields,
      validate(sdk.product.validate),
    ],
    patch: [
      authenticate('jwt'),
      queryWithCurrentUser(['soldBy']),
      pickFields(allowSetFields),
      assignPreviousProduct,
      removeDuplicates('groups'),
      calculateFields,
      validate(sdk.product.validate),
    ],
    remove: [authenticate('jwt'), queryWithCurrentUser(['soldBy'])],
  },

  after: {
    all: [],
    find: [allowFields(['soldBy'], allowedFields)],
    get: [allowFields(['soldBy'], allowedFields)],
    create: [createProductSearch, createStoreCategories, createProductGroups],
    patch: [patchProductSearch, patchStoreCategories, patchProductGroups],
    remove: [removeProductSearch, removeStoreCategories, removeProductGroups],
  },
};
