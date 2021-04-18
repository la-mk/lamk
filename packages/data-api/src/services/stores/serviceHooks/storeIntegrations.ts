import { HookContext } from '@feathersjs/feathers';
import { checkContext } from 'feathers-hooks-common';

export const createStoreIntegrationsIfNotExists = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['create']);
  const store = ctx.result;
  const existingStoreIntegrations = await ctx.app.services[
    'storeIntegrations'
  ].find({
    query: { forStore: store._id },
    user: ctx.params.user,
    authenticated: true,
  });

  if (existingStoreIntegrations.total > 0) {
    return;
  }

  await ctx.app.services['storeIntegrations'].create(
    { forStore: store._id },
    { user: ctx.params.user, authenticated: true },
  );
};

export const removeStoreIntegrations = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['remove']);
  const store = ctx.result;

  const StoreIntegrations = await ctx.app.services['storeIntegrations'].find(
    {
      query: { forStore: store._id },
    },
    { user: ctx.params.user, authenticated: true },
  );

  if (StoreIntegrations.total === 0) {
    return;
  }

  await ctx.app.services['storeIntegrations'].remove(
    StoreIntegrations.data[0]._id,
    {
      user: ctx.params.user,
      authenticated: true,
    },
  );
};
