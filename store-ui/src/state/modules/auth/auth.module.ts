// The token state is kept in the sdk, so we only use actions for now.

interface Credentials {
  email: string;
  password: string;
}

export const LOGOUT = 'auth/LOGOUT';
export function logout() {
  return { type: LOGOUT };
}

export const LOGIN = 'auth/LOGIN';
export function login(credentials: Credentials, strategy: string) {
  return { type: LOGIN, payload: { credentials, strategy } };
}

export const SIGNUP = 'auth/SIGNUP';
export function signup(credentials: Credentials, strategy: string) {
  return { type: SIGNUP, payload: { credentials, strategy } };
}

export const USER_REQUIRED_ACTION = 'ui/USER_REQUIRED_ACTION';
export function userRequiredAction() {
  return { type: USER_REQUIRED_ACTION };
}
