import merge from 'lodash/fp/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils/utils';
import { Product, schema as productSchema } from './product';
import { Address, schema as addressSchema } from './address/address';
import { Delivery, schema as deliverySchema } from './delivery';
import { validate, validateSingle } from '../utils/modelUtils';
import v8n from 'v8n';

export const schema = {
  orderedFrom: v8n().string().minLength(2).maxLength(63),
  orderedBy: v8n().string().minLength(2).maxLength(63),
  ordered: v8n().every.schema({ 
    product: v8n().schema(productSchema),
    quantity: v8n().number().positive(),
  }),
  status: v8n().oneOf(['cancelled', 'pending', 'shipped', 'completed']),
  delivery: v8n().schema(deliverySchema),
  deliverTo: v8n().schema(addressSchema),
}

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

    validate: (data: Order, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },
  };
};
