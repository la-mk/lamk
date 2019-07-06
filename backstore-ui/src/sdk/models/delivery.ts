import { Application } from '@feathersjs/feathers';

export interface Delivery {
  id: string;
  method: string;
  price: number;
  freeDeliveryOver: number;
  distributor: string;
}

export const getDeliverySdk = (client: Application) => {
  return {
    ...client.service('deliveries'),
  };
};
