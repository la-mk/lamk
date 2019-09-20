export const CLEAR_SESSION = 'ui/CLEAR_SESSION';
export function clearSession() {
  return { type: CLEAR_SESSION };
}

export const TOGGLE_AUTH_MODAL = 'ui/TOGGLE_AUTH_MODAL';
export function toggleAuthModal(state: boolean) {
  return { type: TOGGLE_AUTH_MODAL, state };
}

const initialState = { showAuthModal: false };

export default function ui(state = initialState, action: any) {
  switch (action.type) {
    case TOGGLE_AUTH_MODAL: {
      return { showAuthModal: action.state };
    }
    default:
      return state;
  }
}
