import { createSelector } from 'reselect';

export const getDelivery = createSelector<any, any, any>(
  state => state.delivery,
  delivery => delivery.delivery,
);
