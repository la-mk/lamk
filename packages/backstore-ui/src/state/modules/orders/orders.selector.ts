import { createSelector } from 'reselect';
import { Order } from '@lamk/la-sdk/dist/models/order';

export const getOrders = createSelector<any, any, any>(
  state => state.orders,
  orders => orders.orders,
);

export const getOrder = (id?: string) =>
  createSelector<any, any, any>(
    state => state.orders,
    orders => orders.orders.find((order: Order) => order._id === id),
  );
