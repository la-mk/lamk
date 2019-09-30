import {
  push,
  replace,
  goBack as cGoBack,
  goForward as cGoForward,
  LOCATION_CHANGE as cLOCATION_CHANGE,
} from 'connected-react-router';

export const goTo = push;
export const replaceTo = replace;
export const goBack = cGoBack;
export const goForward = cGoForward;

export const LOCATION_CHANGE = cLOCATION_CHANGE;
