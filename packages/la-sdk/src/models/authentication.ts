import { Application } from '@feathersjs/feathers';

export const getAuthenticationSdk = (client: Application) => {
  return {
    reAuthenticate: client.reAuthenticate,
    authenticate: client.authenticate,
    logout: client.logout,
    getAuthentication: () => client.get('authentication'),
  };
};
