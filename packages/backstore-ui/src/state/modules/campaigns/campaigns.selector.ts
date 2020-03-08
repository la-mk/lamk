import { createSelector } from 'reselect';

export const getCampaigns = createSelector<any, any, any>(
  state => state.campaigns,
  campaigns => campaigns.campaigns,
);
