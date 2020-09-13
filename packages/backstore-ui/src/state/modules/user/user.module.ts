import { User } from '@sradevski/la-sdk/dist/models/user';
import { enhanceReducer } from '../../utils';

const initialState = { user: null };

export const SET_USER = 'user/SET_USER';
const PATCH_USER = 'user/PATCH_USER';

function user(state = initialState, action: any) {
  switch (action.type) {
    case SET_USER: {
      return { user: action.user };
    }
    case PATCH_USER: {
      return { ...state, user: { ...(state.user ?? {}), ...action.user } };
    }
    default:
      return state;
  }
}

export default enhanceReducer(user);

export function setUser(user: User) {
  return {
    type: SET_USER,
    user,
  };
}

export function patchUser(user: Partial<User>) {
  return {
    type: PATCH_USER,
    user,
  };
}
