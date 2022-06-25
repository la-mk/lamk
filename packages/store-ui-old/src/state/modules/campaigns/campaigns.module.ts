import { Campaign } from '@la-mk/la-sdk/dist/models/campaign';

const initialState = { campaigns: null };

const SET_CAMPAIGNS = 'campaigns/SET_CAMPAIGNS';

export default function campaigns(state = initialState, action: any) {
  switch (action.type) {
    case SET_CAMPAIGNS: {
      return { campaigns: action.campaigns };
    }
    default:
      return state;
  }
}

export function setCampaigns(campaigns: Campaign[]) {
  return {
    type: SET_CAMPAIGNS,
    campaigns,
  };
}
