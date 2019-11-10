import merge from 'lodash/fp/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils/utils';

export interface Delivery {
  _id: string;
  forStore: string;
  method: 'pickup' | 'cargo-pickup' | 'door-to-door';
  price: number;
  freeDeliveryOver: number;
  createdAt: string;
  modifiedAt: string;
}

export const getDeliverySdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<Delivery>, Delivery>(
    client,
    'deliveries',
  );

  return {
    ...crudMethods,

    findForStore: (storeId: string, params?: Params) => {
      const options = merge({ query: { forStore: storeId } }, params);
      return crudMethods.find(options);
    },

    validate: (data: Delivery, ignoreRequired = false) => {
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
