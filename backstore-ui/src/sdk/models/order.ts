import merge from 'lodash/fp/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';

export interface OrderItem {
  product: string;
  quantity: number;
}

export interface Order {
  _id: string;
  orderedFrom: string;
  orderedBy: string;
  ordered: OrderItem[];
  status: 'cancelled' | 'pending' | 'complete';
  createdAt: string;
  modifiedAt: string;
}

export const getOrderSdk = (client: Application) => {
  const crudMethods = getCrudMethods(client, 'orders');
  return {
    ...crudMethods,

    findForStore: (storeId: string, params?: Params) => {
      const options = merge({ query: { orderedFrom: storeId } }, params);
      return crudMethods.find(options);
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
