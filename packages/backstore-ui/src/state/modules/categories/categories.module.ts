import { Category } from '@lamk/la-sdk/dist/models/category';

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

export function setCategories(categories: Category[]) {
  return {
    type: SET_CATEGORIES,
    categories,
  };
}
