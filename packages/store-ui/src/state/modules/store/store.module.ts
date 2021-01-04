import { Store } from '@la-mk/la-sdk/dist/models/store';

const initialState = { store: null };

export const SET_STORE = 'store/SET_STORE';

export default function store(state = initialState, action: any) {
  switch (action.type) {
    case SET_STORE: {
      return { store: action.store };
    }
    default:
      return state;
  }
}

export function setStore(store: Store) {
  return {
    type: SET_STORE,
    store,
  };
}
