export const CLEAR_SESSION = 'ui/CLEAR_SESSION';
export function clearSession() {
  return { type: CLEAR_SESSION };
}

export const TOGGLE_AUTH_MODAL = 'ui/TOGGLE_AUTH_MODAL';
export const SET_UI_LOADED = 'ui/SET_UI_LOADED';

export function toggleAuthModal(state: boolean) {
  return { type: TOGGLE_AUTH_MODAL, state };
}

export function setUiLoaded() {
  return { type: SET_UI_LOADED };
}

const initialState = { shouldShowAuthModal: false };

export default function ui(state = initialState, action: any) {
  switch (action.type) {
    case TOGGLE_AUTH_MODAL: {
      return { shouldShowAuthModal: action.state };
    }
    default:
      return state;
  }
}
