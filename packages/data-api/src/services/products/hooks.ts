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
  // If we are creating the object, we are sure the price field is present.
  if (ctx.method === 'create') {
    ctx.data.variants.forEach((variant: Variant) => {
      variant.calculatedPrice = sdk.utils.pricing.calculateProductPrice(
        variant,
      );

      if (variant.calculatedPrice <= 0) {
        throw new BadRequest('Product variant has to have a positive price');
      }

      ctx.data.totalStock = variant.stock
        ? (ctx.data.totalStock ?? 0) + variant.stock
        : undefined;

      ctx.data.minPrice = Math.min(
        ctx.data.minPrice ?? Number.POSITIVE_INFINITY,
        variant.price,
      );
      ctx.data.maxPrice = Math.max(
        ctx.data.maxPrice ?? Number.NEGATIVE_INFINITY,
        variant.price,
      );

      ctx.data.minDiscount = variant.discount
        ? Math.min(
            ctx.data.minDiscount ?? Number.POSITIVE_INFINITY,
            variant.discount,
          )
        : undefined;
      ctx.data.maxDiscount = variant.discount
        ? Math.max(
            ctx.data.maxDiscount ?? Number.NEGATIVE_INFINITY,
            variant.discount,
          )
        : undefined;

      ctx.data.minCalculatedPrice = Math.min(
        ctx.data.minCalculatedPrice ?? Number.POSITIVE_INFINITY,
        variant.calculatedPrice,
      );
      ctx.data.maxCalculatedPrice = Math.max(
        ctx.data.maxCalculatedPrice ?? Number.NEGATIVE_INFINITY,
        variant.calculatedPrice,
      );
    });

    return;
  }

  // If we are patching, and we only patch either just price or discount, we won't have all info to calculate the final price.
  const product = (await ctx.app.services['products'].get(ctx.id)) as
    | Product
    | undefined;

  if (!product) {
    throw new BadRequest('Product could not be found when patching.');
  }

  product.variants.forEach(variant => {
    // TODO: Pass attributes here.
    const patchedVariant = ctx.data.variants.find(() =>
      sdk.product.getVariantForAttributes(product),
    );
    const stock = patchedVariant.stock ?? variant.stock;
    const price = patchedVariant.price ?? variant.price;
    const discount = patchedVariant.discount ?? variant.discount;
    patchedVariant.calculatedPrice = sdk.utils.pricing.calculateProductPrice({
      price,
      discount,
    });

    if (patchedVariant.calculatedPrice <= 0) {
      throw new BadRequest('Product variant has to have a positive price');
    }

    ctx.data.totalStock = stock
      ? (ctx.data.totalStock ?? 0) + stock
      : undefined;

    ctx.data.minPrice = Math.min(
      ctx.data.minPrice ?? Number.POSITIVE_INFINITY,
      price,
    );
    ctx.data.maxPrice = Math.max(
      ctx.data.maxPrice ?? Number.NEGATIVE_INFINITY,
      price,
    );

    ctx.data.minDiscount = discount
      ? Math.min(ctx.data.minDiscount ?? Number.POSITIVE_INFINITY, discount)
      : undefined;
    ctx.data.maxDiscount = discount
      ? Math.max(ctx.data.maxDiscount ?? Number.NEGATIVE_INFINITY, discount)
      : undefined;

    ctx.data.minCalculatedPrice = Math.min(
      ctx.data.minCalculatedPrice ?? Number.POSITIVE_INFINITY,
      patchedVariant.calculatedPrice,
    );
    ctx.data.maxCalculatedPrice = Math.max(
      ctx.data.maxCalculatedPrice ?? Number.NEGATIVE_INFINITY,
      patchedVariant.calculatedPrice,
    );
  });
};

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
      removeDuplicates('groups'),
      calculateFields,
      validate(sdk.product.validate),
    ],
    patch: [
      authenticate('jwt'),
      queryWithCurrentUser(['soldBy']),
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
