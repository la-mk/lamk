import { Application } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';

export interface Delivery {
  _id: string;
  forStore: string;
  method: string;
  price: number;
  freeDeliveryOver: number;
  createdAt: string;
  modifiedAt: string;
}

export const getDeliverySdk = (client: Application) => {
  return {
    ...getCrudMethods<OmitServerProperties<Delivery>, Delivery>(
      client,
      'deliveries',
    ),

    validate: (data: Delivery, considerRequired = true) => {
      if (!data.price) {
        return { price: 'Price is missing' };
      }
    },
    validateSingle: (val: any, selector: string) => {
      if (!val) {
        return 'xxx is required';
      }
    },
  };
};
