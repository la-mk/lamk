import { getStore } from '../../../src/state/modules/store/store.selector';
import { getDelivery } from '../../../src/state/modules/delivery/delivery.selector';
import { sdk } from 'la-sdk';
import { setDelivery } from '../../../src/state/modules/delivery/delivery.module';
import { NextPageContext } from 'next';

export const setDeliveryIfNone = (ctx: NextPageContext & { store: any }) => {
  const state = ctx.store.getState();
  const store = getStore(state);
  const delivery = getDelivery(state);

  const deliveryAction = delivery
    ? Promise.resolve(delivery)
    : sdk.delivery.findForStore(store._id);

  return deliveryAction
    .then(deliveryInfo => {
      if (deliveryInfo && deliveryInfo.total > 0) {
        ctx.store.dispatch(setDelivery(deliveryInfo.data[0]));
      }
    })
    .catch(err => {
      console.log(err);
    });
};
