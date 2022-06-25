import { createSelector } from 'reselect';

export const getLandingContent = createSelector<any, any, any>(
  state => state.storeContents,
  storeContents => storeContents.landingContent,
);

export const getSets = createSelector<any, any, any>(
  getLandingContent,
  landingContent => landingContent?.sets ?? [],
);

export const getPromotedSets = createSelector<any, any, any>(getSets, sets =>
  sets.filter(set => set.isPromoted),
);
