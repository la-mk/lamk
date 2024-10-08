import { HookContext } from '@feathersjs/feathers';
import { checkContext } from 'feathers-hooks-common';

export const createCartForUser = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['create']);
  const user = ctx.result;
  const existingUserCart = await ctx.app.services['carts'].find({
    query: { forUser: user._id },
    user,
    authenticated: true,
  });

  if (existingUserCart.total > 0) {
    return;
  }

  await ctx.app.services['carts'].create(
    { forUser: user._id, items: [] },
    { user, authenticated: true },
  );
};

export const removeCartForUser = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['remove']);

  const user = ctx.result;
  const userCart = await ctx.app.services['carts'].find({
    query: { forUser: user._id },
    user,
    authenticated: true,
  });

  if (userCart.total === 0) {
    return;
  }

  await ctx.app.services['carts'].remove(userCart.data[0]._id, {
    user,
    authenticated: true,
  });
};
