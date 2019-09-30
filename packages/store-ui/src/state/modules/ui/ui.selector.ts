import { createSelector } from 'reselect';

export const shouldShowAuthModal = createSelector<any, any, any>(
  state => state.ui,
  ui => ui.shouldShowAuthModal,
);
