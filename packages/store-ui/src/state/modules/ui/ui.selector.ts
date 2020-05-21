import { createSelector } from 'reselect';

export const shouldShowAuthModal = createSelector<any, any, any>(
  state => state.ui,
  ui => ui.shouldShowAuthModal,
);

export const getBreadcrumbs = createSelector<any, any, any>(
  state => state.ui,
  ui => ui.breadcrumbs,
);

export const getPreviousPage = createSelector<any, any, any>(
  state => state.ui,
  ui => ui.previousPage,
);
