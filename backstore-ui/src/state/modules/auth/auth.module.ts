// The token state is kept in the sdk, so we only use actions for now.
export const LOGOUT = 'auth/LOGOUT';
export function logout() {
  return { type: LOGOUT };
}
