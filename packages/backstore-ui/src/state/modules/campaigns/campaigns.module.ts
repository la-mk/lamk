import { Campaign } from '@la-mk/la-sdk/dist/models/campaign';

const initialState: { campaigns: Campaign[] } = { campaigns: [] };

const SET_CAMPAIGNS = 'campaigns/SET_CAMPAIGNS';
const ADD_CAMPAIGN = 'campaigns/ADD_CAMPAIGN';
const PATCH_CAMPAIGN = 'campaigns/PATCH_CAMPAIGN';
const REMOVE_CAMPAIGN = 'campaigns/REMOVE_CAMPAIGN';

export default function campaigns(state = initialState, action: any) {
  switch (action.type) {
    case SET_CAMPAIGNS: {
      return {
        ...state,
        campaigns: action.campaigns,
      };
    }
    case ADD_CAMPAIGN: {
      return {
        ...state,
        campaigns: [...state.campaigns, action.campaign],
      };
    }
    case PATCH_CAMPAIGN: {
      return {
        ...state,
        campaigns: state.campaigns.map(campaign => {
          if (campaign._id === action.campaign._id) {
            return action.campaign;
          }

          return campaign;
        }),
      };
    }
    case REMOVE_CAMPAIGN: {
      return {
        ...state,
        campaigns: state.campaigns.filter(
          (campaign: Campaign) => campaign._id !== action.id,
        ),
      };
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

export function addCampaign(campaign: Campaign) {
  return {
    type: ADD_CAMPAIGN,
    campaign,
  };
}

export function patchCampaign(campaign: Campaign) {
  return {
    type: PATCH_CAMPAIGN,
    campaign,
  };
}

export function removeCampaign(id: string) {
  return {
    type: REMOVE_CAMPAIGN,
    id,
  };
}
