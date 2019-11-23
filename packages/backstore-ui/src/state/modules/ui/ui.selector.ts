import { createSelector } from 'reselect';

export const getUiReady = createSelector<any, any, any>(
  state => state.ui,
  ui => ui.uiReady,
);
