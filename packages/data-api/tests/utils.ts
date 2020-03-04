import { User } from '@sradevski/la-sdk/dist/models/user';

export const getExternalUserParams = (user: User) => {
  return {
    provider: 'rest',
    authenticated: true,
    user: user,
  };
};
