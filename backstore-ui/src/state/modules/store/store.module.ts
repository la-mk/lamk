import { Store } from '../../../sdk/models/store';

const initialState = { store: {} };

const SET_STORE = 'store/CREATE_STORE';

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
