import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import {
  restrictToOwner,
  associateCurrentUser,
} from 'feathers-authentication-hooks';
import { requireAnyQueryParam, isOwner } from '../../common/hooks/filtering';
import { unless, keep, checkContext, discard } from 'feathers-hooks-common';
import { HookContext } from '@feathersjs/feathers';
import { BadRequest } from '../../common/errors';
import { sdk } from '@sradevski/la-sdk';
import { validate, convertQueryToNumber } from '../../common/hooks/db';
import { logger } from '../../common/logger';

interface HookContextWithCategory extends HookContext {
  previousCategory?: string;
}

const createCategoryPerStoreIfNotExists = async (
  level3: string,
  forStore: string,
  ctx: HookContext,
) => {
  const existingCategoryResult = await ctx.app.services[
    'categoriesPerStore'
  ].find({
    query: {
      level3,
      forStore,
    },
  });

  if (existingCategoryResult.total > 0) {
    return;
  }

  const fullCategoryResult = await ctx.app.services['categories'].find({
    query: {
      level3,
    },
  });

  if (fullCategoryResult.total === 0) {
    throw new BadRequest('The specified category does not exist');
  }

  const storeCategory = {
    ...fullCategoryResult.data[0],
    forStore,
  };

  await ctx.app.services['categoriesPerStore'].create(storeCategory);
};

const removeOrphanedCategoryPerStore = async (
  level3: string | undefined,
  forStore: string,
  ctx: HookContext,
) => {
  if (!level3) {
    return;
  }

  const productsWithCategoryResult = await ctx.app.services['products'].find({
    query: {
      category: level3,
      soldBy: forStore,
    },
  });

  if (productsWithCategoryResult.total > 0) {
    return;
  }

  // The category is not in use anymore, so it is safe to remove.
  await ctx.app.services['categoriesPerStore'].remove(null, {
    query: {
      level3,
      forStore,
    },
  });
};

const createCategoriesPerStore = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['create', 'patch']);
  const product = ctx.result;

  try {
    await createCategoryPerStoreIfNotExists(
      product.category,
      product.soldBy,
      ctx,
    );
  } catch (err) {
    // We don't want to throw at this point, log the error and if needed fix it manually until we get rollbacks.
    logger.error(err);
  }
};

const patchCategoriesPerStore = async (ctx: HookContextWithCategory) => {
  checkContext(ctx, 'after', ['patch']);
  const product = ctx.result;
  const previousCategory = ctx.previousCategory;

  try {
    await removeOrphanedCategoryPerStore(previousCategory, product.soldBy, ctx);
    await createCategoryPerStoreIfNotExists(
      product.category,
      product.soldBy,
      ctx,
    );
  } catch (err) {
    // We don't want to throw at this point, log the error and if needed fix it manually until we get rollbacks.
    logger.error(err);
  }
};

// For a patch, even if the category hasn't changed, this will first remove the category, and then add it in an after hook. Fix it when it becomes a problem.
const removeCategoriesPerStore = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['remove']);

  const removedProduct = ctx.result;
  if (!removedProduct.category) {
    return;
  }

  try {
    await removeOrphanedCategoryPerStore(
      removedProduct.category,
      removedProduct.soldBy,
      ctx,
    );
  } catch (err) {
    // We don't want to throw at this point, log the error and if needed fix it manually until we get rollbacks.
    logger.error(err);
  }
};

const assignPreviousCategory = async (ctx: HookContext) => {
  checkContext(ctx, 'before', ['patch']);
  const product = await ctx.app.services['products'].get(ctx.id);
  (ctx as HookContextWithCategory).previousCategory = product.category;
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
      validate(sdk.product.validate),
    ],
    patch: [
      authenticate('jwt'),
      restrictToOwner({ ownerField: 'soldBy' }),
      assignPreviousCategory,
      discard('_id'),
      validate(sdk.product.validate),
    ],
    remove: [authenticate('jwt'), restrictToOwner({ ownerField: 'soldBy' })],
  },

  after: {
    all: [],
    find: [
      unless(
        isOwner('soldBy'),
        keep(
          '_id',
          'name',
          'price',
          'category',
          'images',
          'description',
          'soldBy',
          'sku',
        ),
      ),
    ],
    get: [
      unless(
        isOwner('soldBy'),
        keep(
          '_id',
          'name',
          'price',
          'category',
          'images',
          'description',
          'soldBy',
          'sku',
        ),
      ),
    ],
    create: [createCategoriesPerStore],
    patch: [patchCategoriesPerStore],
    remove: [removeCategoriesPerStore],
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
