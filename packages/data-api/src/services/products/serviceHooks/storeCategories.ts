import { HookContext } from '@feathersjs/feathers';
import { BadRequest } from '../../../common/errors';
import { checkContext } from 'feathers-hooks-common';
import { logger } from '../../../common/logger';
import { Product } from '@la-mk/la-sdk/dist/models/product';
import { HookContextWithState } from '../../../common/types';

const createStoreCategoryIfNotExists = async (
  level3: string,
  forStore: string,
  ctx: HookContext,
) => {
  const existingCategoryResult = await ctx.app.services['storeCategories'].find(
    {
      query: {
        level3,
        forStore,
      },
    },
  );

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

  await ctx.app.services['storeCategories'].create(storeCategory);
};

const removeOrphanedStoreCategory = async (
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
  await ctx.app.services['storeCategories'].remove(null, {
    query: {
      level3,
      forStore,
    },
  });
};

export const createStoreCategories = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['create', 'patch']);
  const product = ctx.result;

  try {
    await createStoreCategoryIfNotExists(product.category, product.soldBy, ctx);
  } catch (err) {
    // We don't want to throw at this point, log the error and if needed fix it manually until we get rollbacks.
    logger.error(err);
  }
};

// For a patch, even if the category hasn't changed, this will first remove the category, and then add it in an after hook. Fix it when it becomes a problem.
export const patchStoreCategories = async (
  ctx: HookContextWithState<Product>,
) => {
  checkContext(ctx, 'after', ['patch']);
  const product = ctx.result;
  const previousProduct = ctx.contextState;

  try {
    await removeOrphanedStoreCategory(
      previousProduct?.category,
      product.soldBy,
      ctx,
    );
    await createStoreCategoryIfNotExists(product.category, product.soldBy, ctx);
  } catch (err) {
    // We don't want to throw at this point, log the error and if needed fix it manually until we get rollbacks.
    logger.error(err);
  }
};

export const removeStoreCategories = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['remove']);

  const removedProduct = ctx.result;
  if (!removedProduct.category) {
    return;
  }

  try {
    await removeOrphanedStoreCategory(
      removedProduct.category,
      removedProduct.soldBy,
      ctx,
    );
  } catch (err) {
    // We don't want to throw at this point, log the error and if needed fix it manually until we get rollbacks.
    logger.error(err);
  }
};
