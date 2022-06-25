import { createSelector } from 'reselect';

export const getUser = createSelector<any, any, any>(
  state => state.user,
  user => user.user,
);

export const getAddresses = createSelector<any, any, any>(
  state => state.user,
  user => user.addresses,
);
