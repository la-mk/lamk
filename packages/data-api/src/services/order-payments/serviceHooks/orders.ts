import { checkContext } from 'feathers-hooks-common';
import { HookContext } from '@feathersjs/feathers';
import { sdk } from '@la-mk/la-sdk';
import { NotFound } from '../../../common/errors';

export const setOrderStatus = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['create']);
  const { forOrder, isSuccessful } = ctx.result;

  if (!isSuccessful) {
    return;
  }

  try {
    await ctx.app.services['orders'].patch(
      forOrder,
      {
        status: sdk.order.OrderStatus.PENDING_SHIPMENT,
      },
      { query: { status: sdk.order.OrderStatus.PENDING_PAYMENT } },
    );
  } catch (err) {
    // bug: as of now (March 2020) if you modify a field you query on, the patch will be successful but it will still throw a notfound error. If the order doesn't have a pending payment status (in case the store modified it themselves for some reason), just continue
    if (err instanceof NotFound) {
      return;
    }

    throw err;
  }
};
