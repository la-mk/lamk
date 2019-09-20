import { createSelector } from 'reselect';

export const showAuthModal = createSelector<any, any, any>(
  state => state.ui,
  ui => ui.showAuthModal,
);
