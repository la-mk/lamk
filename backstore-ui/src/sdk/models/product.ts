import { Application } from '@feathersjs/feathers';

export const getProductSdk = (client: Application) => {
  return {
    ...client.service('products'),
  };
};
