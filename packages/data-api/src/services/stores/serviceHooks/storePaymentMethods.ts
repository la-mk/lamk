import { HookContext } from '@feathersjs/feathers';
import { checkContext } from 'feathers-hooks-common';
import { sdk } from '@la-mk/la-sdk';

export const createStorePaymentMethodsIfNotExists = async (
  ctx: HookContext,
) => {
  checkContext(ctx, 'after', ['create']);
  const store = ctx.result;
  const existingStorePaymentMethods = await ctx.app.services[
    'storePaymentMethods'
  ].find({
    query: { forStore: store._id },
    user: ctx.params.user,
    authenticated: true,
  });

  if (existingStorePaymentMethods.total > 0) {
    return;
  }

  await ctx.app.services['storePaymentMethods'].create(
    {
      forStore: store._id,
      methods: [
        {
          name: sdk.storePaymentMethods.PaymentMethodNames.PAY_ON_DELIVERY,
        },
      ],
    },
    { user: ctx.params.user, authenticated: true },
  );
};

export const removeStorePaymentMethods = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['remove']);
  const store = ctx.result;

  const storePaymentMethods = await ctx.app.services[
    'storePaymentMethods'
  ].find(
    {
      query: { forStore: store._id },
    },
    { user: ctx.params.user, authenticated: true },
  );

  if (storePaymentMethods.total === 0) {
    return;
  }

  await ctx.app.services['storePaymentMethods'].remove(
    storePaymentMethods.data[0]._id,
    {
      user: ctx.params.user,
      authenticated: true,
    },
  );
};
