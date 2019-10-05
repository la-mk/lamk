import { User } from '@lamk/la-sdk/dist/models/user';

const initialState = { user: null };

const SET_USER = 'user/SET_USER';

export default function user(state = initialState, action: any) {
  switch (action.type) {
    case SET_USER: {
      return { user: action.user };
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
