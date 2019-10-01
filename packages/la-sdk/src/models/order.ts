import merge from 'lodash/fp/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { Product } from './product';
import { Address } from './address';
import { Delivery } from './delivery';

export interface OrderItem {
  // We want to store the actual product, so if the product is modified they can still see the exact thing that was ordered
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  orderedFrom: string;
  orderedBy: string;
  ordered: OrderItem[];
  status: 'cancelled' | 'pending' | 'shipped' | 'completed';
  delivery: Delivery;
  deliverTo?: Address;
  createdAt: string;
  modifiedAt: string;
}

export const getOrderSdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<Order>, Order>(
    client,
    'orders',
  );
  return {
    ...crudMethods,

    findForStore: (storeId: string, params?: Params) => {
      const options = merge({ query: { orderedFrom: storeId } }, params);
      return crudMethods.find(options);
    },

    findForUser: (userId: string, params?: Params) => {
      const options = merge({ query: { orderedBy: userId } }, params);
      return crudMethods.find(options);
    },

    setStatus: (orderId: string, status: Order['status'], params?: Params) => {
      return crudMethods.patch(orderId, { status }, params);
    },

    validate: (data: Order, considerRequired = true) => {
      if (!data._id) {
        return { _id: 'Id is missing' };
      }
    },
    validateSingle: (val: any, selector: string) => {
      if (!val) {
        return 'xxx is required';
      }
    },
  };
};
