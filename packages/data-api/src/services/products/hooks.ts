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

    // We check for null explicitly, meaning at least one of the variants has a null stock, so we don't want to track stocks.
    if (ctx.data.totalStock !== null) {
      ctx.data.totalStock =
        variant.stock == null
          ? null
          : (ctx.data.totalStock ?? 0) + variant.stock;
    }

    const isMinPriceVariant =
      variant.calculatedPrice <=
      (ctx.data.minCalculatedPrice ?? Number.POSITIVE_INFINITY);
    const isMaxPriceVariant =
      variant.calculatedPrice >=
      (ctx.data.maxCalculatedPrice ?? Number.NEGATIVE_INFINITY);

    if (isMinPriceVariant) {
      ctx.data.minPrice = variant.price;
      ctx.data.minDiscount = variant.discount;
      ctx.data.minCalculatedPrice = variant.calculatedPrice;
    }

    if (isMaxPriceVariant) {
      ctx.data.maxPrice = variant.price;
      ctx.data.maxDiscount = variant.discount;
      ctx.data.maxCalculatedPrice = variant.calculatedPrice;
    }
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
