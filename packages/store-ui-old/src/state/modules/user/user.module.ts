import { User } from '@la-mk/la-sdk/dist/models/user';
import { Address } from '@la-mk/la-sdk/dist/models/address/address';

const initialState = { user: null, addresses: null };

export const SET_USER = 'user/SET_USER';
const PATCH_USER = 'user/PATCH_USER';
const SET_ADDRESSES = 'user/SET_ADDRESSES';

export default function user(state = initialState, action: any) {
  switch (action.type) {
    case SET_USER: {
      return { ...state, user: action.user };
    }
    case PATCH_USER: {
      return { ...state, user: { ...(state.user ?? {}), ...action.user } };
    }
    case SET_ADDRESSES: {
      return { ...state, addresses: action.addresses };
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

export function setAddresses(addresses: Address[]) {
  return {
    type: SET_ADDRESSES,
    addresses,
  };
}

export function patchUser(user: Partial<User>) {
  return {
    type: PATCH_USER,
    user,
  };
}
