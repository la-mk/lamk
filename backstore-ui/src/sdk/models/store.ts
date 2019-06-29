import { Application } from '@feathersjs/feathers';

export const getStoreSdk = (client: Application) => {
  return {
    ...client.service('stores'),
  };
};
