import { createSelector } from 'reselect';

export const getStore = createSelector<any, any, any>(
  state => state.store,
  store => store.store,
);
