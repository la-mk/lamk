import {
  standardFetchReducer,
  // standardUpdateReducer,
} from '../../utils/reducerHelpers';
import { sdk } from '../../../sdk';

const initialState = { store: {} };

// TODO: Automatically generate the standard CRUD actions, with 'getting', 'creating' flags
// and 'getError', 'createError' flags.

const GET_STORE = 'store/GET_STORE';
// const CREATE_STORE = 'store/CREATE_STORE';
// const UPDATE_STORE = 'store/UPDATE_STORE';
// const PATCH_STORE = 'store/PATCH_STORE';
// const DELETE_STORE = 'store/DELETE_STORE';

const findStoreReducer = standardFetchReducer(GET_STORE, (data: any) => ({
  store: data,
}));

export default function user(state = initialState, action: any) {
  if (action.type.includes(GET_STORE)) {
    return findStoreReducer(state, action);
  }

  switch (action.type) {
    default:
      return state;
  }
}

export function findStore() {
  return {
    type: GET_STORE,
    request: {
      promise: sdk.store.get('123'),
    },
  };
}
