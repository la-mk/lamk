import {
  push,
  replace,
  goBack as cGoBack,
  goForward as cGoForward,
} from 'connected-react-router';

export const goTo = push;
export const replaceTo = replace;
export const goBack = cGoBack;
export const goForward = cGoForward;
