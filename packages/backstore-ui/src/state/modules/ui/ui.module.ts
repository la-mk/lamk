const initialState = { uiReady: false };

export const CLEAR_SESSION = 'ui/CLEAR_SESSION';
export const SET_UI_READY = 'ui/SET_UI_READY';

export default function uiReady(state = initialState, action: any) {
  switch (action.type) {
    case SET_UI_READY: {
      return { uiReady: action.uiReady };
    }
    default:
      return state;
  }
}

export function clearSession() {
  return { type: CLEAR_SESSION };
}

export function setUiReady(uiReady: boolean) {
  return { type: SET_UI_READY, uiReady };
}
