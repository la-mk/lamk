import { User } from '@lamk/la-sdk/dist/models/user';
import { enhanceReducer } from '../../utils';

const initialState = { user: null };

export const SET_USER = 'user/SET_USER';

function user(state = initialState, action: any) {
  switch (action.type) {
    case SET_USER: {
      return { user: action.user };
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
