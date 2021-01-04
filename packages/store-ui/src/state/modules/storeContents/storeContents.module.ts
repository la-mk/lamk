import { StoreContents } from '@la-mk/la-sdk/dist/models/storeContents';

const initialState = { landingContent: null };

const SET_LANDING_CONTENT = 'delivery/SET_LANDING_CONTENT';

export default function storeContents(state = initialState, action: any) {
  switch (action.type) {
    case SET_LANDING_CONTENT: {
      return { landingContent: action.landingContent };
    }
    default:
      return state;
  }
}

export function setLandingContent(landingContent: StoreContents['landing']) {
  return {
    type: SET_LANDING_CONTENT,
    landingContent,
  };
}
