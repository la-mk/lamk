import { checkContext } from 'feathers-hooks-common';
import { HookContext } from '@feathersjs/feathers';
import { logger } from '../../../common/logger';

export const createProductSearch = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['create']);
  const product = ctx.result;

  try {
    await ctx.app.services['search'].create({
      model: 'products',
      item: product,
    });
  } catch (err) {
    // We don't want to throw at this point, log the error and if needed fix it manually until we get rollbacks.
    logger.error('Failed to create product for search', product._id, err);
  }
};

export const patchProductSearch = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['patch']);
  const product = ctx.result;

  try {
    await ctx.app.services['search'].patch(product._id, {
      model: 'products',
      item: product,
    });
  } catch (err) {
    // We don't want to throw at this point, log the error and if needed fix it manually until we get rollbacks.
    logger.error('Failed to patch product for search', product._id, err);
  }
};

export const removeProductSearch = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['remove']);
  const product = ctx.result;

  try {
    await ctx.app.services['search'].remove(product._id, { model: 'products' });
  } catch (err) {
    // We don't want to throw at this point, log the error and if needed fix it manually until we get rollbacks.
    logger.error('Failed to remove product for search', product._id, err);
  }
};
