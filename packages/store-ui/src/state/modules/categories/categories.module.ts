import { StoreCategory } from '@sradevski/la-sdk/dist/models/storeCategory';

const initialState = { categories: null };

const SET_CATEGORIES = 'categories/SET_CATEGORIES';

export default function categories(state = initialState, action: any) {
  switch (action.type) {
    case SET_CATEGORIES: {
      return { categories: action.categories };
    }
    default:
      return state;
  }
}

export function setCategories(categories: StoreCategory[]) {
  return {
    type: SET_CATEGORIES,
    categories,
  };
}
