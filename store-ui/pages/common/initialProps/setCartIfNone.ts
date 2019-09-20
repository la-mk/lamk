import { NextPageContext } from 'next';
import { getUser } from '../../../src/state/modules/user/user.selector';
import { getCartWithProducts } from '../../../src/state/modules/cart/cart.selector';
import { sdk } from 'la-sdk';
import { CartWithProducts } from 'la-sdk/dist/models/cart';
import { setCartWithProducts } from '../../../src/state/modules/cart/cart.module';

export const setCartIfNone = (ctx: NextPageContext & { store: any }) => {
  const state = ctx.store.getState();
  const user = getUser(state);
  const cart = getCartWithProducts(state);

  const cartAction: Promise<CartWithProducts | void> =
    user && !cart
      ? sdk.cart.getCartWithProductsForUser(user._id)
      : Promise.resolve(null);

  return cartAction
    .then(cartWithProducts => {
      if (cartWithProducts) {
        ctx.store.dispatch(setCartWithProducts(cartWithProducts));
      }
    })
    .catch(err => {
      console.log(err);
    });
};
