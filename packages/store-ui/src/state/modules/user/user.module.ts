import { User } from 'la-sdk/dist/models/user';

const initialState = { user: null };

const SET_USER = 'user/SET_USER';
const PATCH_USER = 'user/PATCH_USER';

export default function user(state = initialState, action: any) {
  switch (action.type) {
    case SET_USER: {
      return { user: action.user };
    }
    case PATCH_USER: {
      return { user: { ...state.user, ...action.user } };
    }
    default:
      return state;
  }
}

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
