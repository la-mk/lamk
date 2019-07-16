import { createSelector } from 'reselect';

export const getOrders = createSelector<any, any, any>(
  state => state.orders,
  orders => orders.orders,
);
