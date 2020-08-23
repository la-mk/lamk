import { createSelector } from 'reselect';

export const getCartWithProducts = createSelector<any, any, any>(
  state => state.cart,
  cart => cart.cartWithProducts,
);

export const getCartCount = createSelector<any, any, any>(
  state => state.cart,
  cart => cart.cartWithProducts?.items?.length,
);
