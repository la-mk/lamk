import { createSelector } from 'reselect';

export const getConsents = createSelector<any, any, any>(
  state => state.analytics,
  analytics => analytics.consents,
);
