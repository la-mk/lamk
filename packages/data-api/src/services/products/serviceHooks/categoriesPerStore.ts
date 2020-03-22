import { HookContext } from '@feathersjs/feathers';
import { BadRequest } from '../../../common/errors';
import { checkContext } from 'feathers-hooks-common';
import { logger } from '../../../common/logger';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { HookContextWithState } from '../../../common/types';

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

export const createCategoriesPerStore = async (ctx: HookContext) => {
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

// For a patch, even if the category hasn't changed, this will first remove the category, and then add it in an after hook. Fix it when it becomes a problem.
export const patchCategoriesPerStore = async (
  ctx: HookContextWithState<Product>,
) => {
  checkContext(ctx, 'after', ['patch']);
  const product = ctx.result;
  const previousProduct = ctx.contextState;

  try {
    await removeOrphanedCategoryPerStore(
      previousProduct?.category,
      product.soldBy,
      ctx,
    );
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

export const removeCategoriesPerStore = async (ctx: HookContext) => {
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
