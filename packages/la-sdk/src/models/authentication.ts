import { Application } from '@feathersjs/feathers';

export const getAuthenticationSdk = (client: Application) => {
  return {
    reAuthenticate: client.reAuthenticate,
    authenticate: client.authenticate,
    logout: client.logout,
    getAuthentication: () => client.get('authentication'),
    // We need to create arrow functions to preserve the this context
    getAccessToken: () => client.authentication.getAccessToken(),
    removeAccessToken: () => client.authentication.removeAccessToken(),
  };
};
