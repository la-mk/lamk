import { createSelector } from 'reselect';

export const getProducts = createSelector<any, any, any>(
  state => state.products,
  products => products.products,
);
