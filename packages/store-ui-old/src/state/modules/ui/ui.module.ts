export interface BreadcrumbEntry {
  urlPattern?: string;
  url: string;
  title: string;
}

export const CLEAR_SESSION = 'ui/CLEAR_SESSION';
export const TOGGLE_AUTH_MODAL = 'ui/TOGGLE_AUTH_MODAL';
export const SET_UI_LOADED = 'ui/SET_UI_LOADED';
export const SET_BREADCRUMBS = 'ui/SET_BREADCRUMBS';
export const SET_PREVIOUS_PAGE = 'ui/SET_PREVIOUS_PAGE';

export function clearSession() {
  return { type: CLEAR_SESSION };
}

export function toggleAuthModal(state: boolean) {
  return { type: TOGGLE_AUTH_MODAL, state };
}

export function setUiLoaded() {
  return { type: SET_UI_LOADED };
}

export function setBreadcrumbs(breadcrumbs: BreadcrumbEntry[]) {
  return { type: SET_BREADCRUMBS, breadcrumbs };
}

export function setPreviousPage(href: string) {
  return { type: SET_PREVIOUS_PAGE, href };
}

const initialState = {
  shouldShowAuthModal: false,
  breadcrumbs: [],
  previousPage: undefined,
};

export default function ui(state = initialState, action: any) {
  switch (action.type) {
    case TOGGLE_AUTH_MODAL: {
      return { ...state, shouldShowAuthModal: action.state };
    }
    case SET_BREADCRUMBS: {
      return {
        ...state,
        breadcrumbs: action.breadcrumbs,
      };
    }
    case SET_PREVIOUS_PAGE: {
      return {
        ...state,
        previousPage: action.href,
      };
    }
    default:
      return state;
  }
}
