import { Application } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';

export interface Delivery {
  id: string;
  method: string;
  price: number;
  freeDeliveryOver: number;
  distributor: string;
}

export const getDeliverySdk = (client: Application) => {
  return {
    ...getCrudMethods(client, 'deliveries'),
  };
};
