import { HookContext } from '@feathersjs/feathers';
import { checkContext } from 'feathers-hooks-common';

export const createStoreContentsIfNotExists = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['create']);
  const store = ctx.result;
  const existingStoreContents = await ctx.app.services['storeContents'].find({
    query: { forStore: store._id },
    user: ctx.params.user,
    authenticated: true,
  });

  if (existingStoreContents.total > 0) {
    return;
  }

  await ctx.app.services['storeContents'].create(
    { forStore: store._id, landing: { sets: [] } },
    { user: ctx.params.user, authenticated: true },
  );
};

export const removeStoreContents = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['remove']);
  const store = ctx.result;

  const storeContents = await ctx.app.services['storeContents'].find(
    {
      query: { forStore: store._id },
    },
    { user: ctx.params.user, authenticated: true },
  );

  if (storeContents.total === 0) {
    return;
  }

  await ctx.app.services['storeContents'].remove(storeContents.data[0]._id, {
    user: ctx.params.user,
    authenticated: true,
  });
};
