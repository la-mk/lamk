import { createSelector } from 'reselect';

export const getCampaigns = createSelector<any, any, any>(
  state => state.campaigns,
  campaigns => campaigns.campaigns,
);

export const getPromotedCampaign = createSelector<any, any, any>(
  state => state.campaigns,
  campaigns =>
    campaigns.campaigns
      ? campaigns.campaigns.find(campaign => campaign.isPromoted)
      : null,
);
