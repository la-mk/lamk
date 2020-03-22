import { checkContext } from 'feathers-hooks-common';
import { HookContext } from '@feathersjs/feathers';
import { sdk } from '@sradevski/la-sdk';

export const setOrderStatus = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['create']);
  const { forOrder, isSuccessful } = ctx.result;

  if (!isSuccessful) {
    return;
  }

  await ctx.app.services['orders'].patch(
    forOrder,
    {
      status: sdk.order.OrderStatus.PENDING_SHIPMENT,
    },
    { query: { status: sdk.order.OrderStatus.PENDING_PAYMENT } },
  );
};
