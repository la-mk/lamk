import merge from 'lodash/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { Product, schema as productSchema } from './product';
import { Address, schema as addressSchema } from './address/address';
import { Delivery, schema as deliverySchema } from './delivery';
import { validate, validateSingle } from '../utils/validation';
import v8n from 'v8n';
import { Campaign, schema as campaignSchema } from './campaign';
import { PaymentMethodNames } from './storePaymentMethods';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';

export enum OrderStatus {
  INVALID = 'invalid',
  CANCELLED = 'cancelled',
  PENDING_PAYMENT = 'pendingPayment',
  PENDING_SHIPMENT = 'pendingShipment',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
}

export const orderStatusColor: { [key in OrderStatus]: string } = {
  [OrderStatus.INVALID]: '#A8A8A8',
  [OrderStatus.CANCELLED]: '#FF3838',
  [OrderStatus.PENDING_PAYMENT]: '#FA8231',
  [OrderStatus.PENDING_SHIPMENT]: '#FBC531',
  [OrderStatus.SHIPPED]: '#9C88FF',
  [OrderStatus.COMPLETED]: '#4CD137',
};

export const schema = {
  ...defaultSchemaEntries,
  orderedFrom: v8n().id(),
  orderedBy: v8n().id(),
  ordered: v8n().every.schema({
    product: v8n().schema(productSchema),
    quantity: v8n()
      .number()
      .positive(),
  }),
  status: v8n().oneOf(Object.values(OrderStatus)),
  campaigns: v8n().every.schema(campaignSchema),
  delivery: v8n().schema(deliverySchema),
  deliverTo: v8n().schema(addressSchema),
  paymentMethod: v8n().oneOf(Object.values(PaymentMethodNames)),
  // This field is calculated on the server-side using the price and discount. Use this when sorting and filtering.
  calculatedTotal: v8n().optional(
    v8n()
      .number(false)
      .positive()
  ),
};

export interface OrderItem {
  // We want to store the actual product, so if the product is modified they can still see the exact thing that was ordered
  product: Product;
  quantity: number;
}

export interface Order extends DefaultSchema {
  orderedFrom: string;
  orderedBy: string;
  ordered: OrderItem[];
  status: OrderStatus;
  campaigns: Campaign[];
  delivery: Delivery;
  deliverTo?: Address;
  paymentMethod: PaymentMethodNames;
  calculatedTotal: number;
}

export const getOrderSdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<Order>, Order>(
    client,
    'orders'
  );
  return {
    ...crudMethods,

    findForStore: (storeId: string, params?: Params) => {
      const options = {};
      merge(options, params, { query: { orderedFrom: storeId } });
      return crudMethods.find(options);
    },

    findForUser: (userId: string, params?: Params) => {
      const options = {};
      merge(options, params, { query: { orderedBy: userId } });
      return crudMethods.find(options);
    },

    findForUserFromStore: (
      userId: string,
      storeId: string,
      params?: Params
    ) => {
      const options = {};
      merge(options, params, {
        query: { orderedBy: userId, orderedFrom: storeId },
      });
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

    OrderStatus,
    orderStatusColor,
  };
};
