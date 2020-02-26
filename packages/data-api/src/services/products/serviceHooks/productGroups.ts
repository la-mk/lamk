import * as _ from 'lodash';
import { HookContext } from '@feathersjs/feathers';
import { checkContext } from 'feathers-hooks-common';
import { logger } from '../../../common/logger';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { ProductGroup } from '@sradevski/la-sdk/dist/models/productGroup';
import { HookContextWithState } from '../hooks';
import { FindResult } from '@sradevski/la-sdk/dist/setup';

const createProductGroupsIfNotExist = async (
  groupNames: string[],
  forStore: string,
  ctx: HookContext,
) => {
  const existingGroups: FindResult<ProductGroup> = await ctx.app.services[
    'productGroups'
  ].find({
    query: {
      forStore: forStore,
      groupName: { $in: groupNames },
    },
  });

  await Promise.all(
    groupNames.map(async (groupName: string) => {
      try {
        const existing = existingGroups.data.find(
          group => group.groupName === groupName,
        );

        // There can easily be a race condition here, but it's preferred for now for simplicity reasons.
        if (existing) {
          await ctx.app.services['productGroups'].patch(existing._id, {
            ...existing,
            itemCountInGroup: existing.itemCountInGroup + 1,
          });
        } else {
          await ctx.app.services['productGroups'].create({
            forStore,
            groupName,
            itemCountInGroup: 1,
          });
        }
      } catch (err) {
        // We don't want to throw here, just log that there was an error.
        logger.error(err);
      }
    }),
  );
};

const removeOprhanedProductGroups = async (
  groupNames: string[],
  forStore: string,
  ctx: HookContext,
) => {
  const groups: FindResult<ProductGroup> = await ctx.app.services[
    'productGroups'
  ].find({
    query: {
      forStore: forStore,
      groupName: { $in: groupNames },
    },
  });

  // Only remove groups for which this product held the last group name.
  const [orphanedGroups, groupsToPatch] = _.partition(
    groups.data,
    group => group.itemCountInGroup <= 1,
  );

  await Promise.all(
    groupsToPatch.map(async group => {
      try {
        await ctx.app.services['productGroups'].patch(group._id, {
          ...group,
          itemCountInGroup: group.itemCountInGroup - 1,
        });
      } catch (err) {
        // We don't want to throw here, just log that there was an error.
        logger.error(err);
      }
    }),
  );

  // The group is not in use anymore, so it is safe to remove.
  await ctx.app.services['productGroups'].remove(null, {
    query: {
      _id: { $in: orphanedGroups.map(x => x._id) },
    },
  });
};

export const createProductGroups = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['create', 'patch']);
  const product = ctx.result;

  try {
    await createProductGroupsIfNotExist(product.groups, product.soldBy, ctx);
  } catch (err) {
    // We don't want to throw at this point, log the error and if needed fix it manually until we get rollbacks.
    logger.error(err);
  }
};

export const patchProductGroups = async (
  ctx: HookContextWithState<Product>,
) => {
  checkContext(ctx, 'after', ['patch']);
  const product = ctx.result;
  const previousProduct = ctx.beforeState;

  try {
    await removeOprhanedProductGroups(
      previousProduct?.groups ?? [],
      product.soldBy,
      ctx,
    );
    await createProductGroupsIfNotExist(product.groups, product.soldBy, ctx);
  } catch (err) {
    // We don't want to throw at this point, log the error and if needed fix it manually until we get rollbacks.
    logger.error(err);
  }
};

export const removeProductGroups = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['remove']);
  const removedProduct = ctx.result;
  if (!removedProduct.groups.length) {
    return;
  }

  try {
    await removeOprhanedProductGroups(
      removedProduct.groups,
      removedProduct.soldBy,
      ctx,
    );
  } catch (err) {
    // We don't want to throw at this point, log the error and if needed fix it manually until we get rollbacks.
    logger.error(err);
  }
};
