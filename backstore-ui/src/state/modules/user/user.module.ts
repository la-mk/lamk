import {
  standardFetchReducer,
  standardUpdateReducer,
} from '../../utils/reducerHelpers';
import sdk from '../../../sdk';

const initialState = { userInfo: {} };

const SAVE_USER_INFO = 'user/SAVE_USER_INFO';
const FETCH_USER_INFO = 'user/FETCH_USER_INFO';
const UPDATE_USER_INFO = 'user/UPDATE_USER_INFO';
const DELETE_USER_INFO = 'user/DELETE_USER_INFO';

const fetchUserInfoReducer = standardFetchReducer(
  FETCH_USER_INFO,
  (data: any) => ({
    userInfo: data,
  }),
);

const updateUserInfoReducer = standardUpdateReducer(
  UPDATE_USER_INFO,
  (data: any) => ({
    userInfo: data,
  }),
);

export default function user(state = initialState, action: any) {
  if (action.type.includes(FETCH_USER_INFO)) {
    return fetchUserInfoReducer(state, action);
  }

  if (action.type.includes(UPDATE_USER_INFO)) {
    return updateUserInfoReducer(state, action);
  }

  switch (action.type) {
    case SAVE_USER_INFO: {
      return {
        ...state,
        userInfo: action.user,
      };
    }
    case DELETE_USER_INFO: {
      return {
        ...state,
        userInfo: {},
      };
    }
    default:
      return state;
  }
}

export function fetchUserInfo() {
  return {
    type: FETCH_USER_INFO,
    // request: {
    //   method: 'GET',
    //   url: getRoute('getUser', { id: 'me' }),
    // },
    request: {
      promise: sdk.user.getUser({ id: 'me' }),
    },
    authorize: true,
    forceFetch: true,
  };
}

export function updateUserInfo(updatedUserInfo: any) {
  return {
    type: UPDATE_USER_INFO,
    // request: {
    //   method: 'PUT',
    //   url: getRoute('updateUser'),
    //   data: updatedUserInfo,
    // },
    request: {
      promise: sdk.user.updateUser({ id: 'me' }, updatedUserInfo),
    },
    authorize: true,
  };
}

export function saveUserInfo(user: any) {
  return { user, type: SAVE_USER_INFO };
}

export function deleteUserInfo() {
  return { type: DELETE_USER_INFO };
}
