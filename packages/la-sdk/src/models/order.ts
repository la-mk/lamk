import merge from 'lodash/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { orderProductSchema, OrderProduct } from './product';
import { Address, schema as addressSchema } from './address/address';
import { Delivery, schema as deliverySchema } from './delivery';
import { validate, validateSingle } from '../utils/validation';
import { Campaign, schema as campaignSchema } from './campaign';
import { PaymentMethodNames } from './storePaymentMethods';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';
import { JSONSchemaType } from 'ajv';

export enum OrderStatus {
  INVALID = 'invalid',
  CANCELLED = 'cancelled',
  PENDING_PAYMENT = 'pendingPayment',
  PENDING_SHIPMENT = 'pendingShipment',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
}

export enum DeliveryStatus {
  REQUESTED = 'requested',
  IN_TRANSIT = 'transit',
  DELIVERED = 'delivered',
  UNKNOWN = 'unknown',
}

export const orderStatusColor: { [key in OrderStatus]: string } = {
  [OrderStatus.INVALID]: '#A8A8A8',
  [OrderStatus.CANCELLED]: '#FF3838',
  [OrderStatus.PENDING_PAYMENT]: '#FA8231',
  [OrderStatus.PENDING_SHIPMENT]: '#FBC531',
  [OrderStatus.SHIPPED]: '#9C88FF',
  [OrderStatus.COMPLETED]: '#4CD137',
};

// @ts-ignore the typings are wrong
export const schema: JSONSchemaType<Order> = {
  type: 'object',
  additionalProperties: false,
  required: [
    ...defaultSchemaEntries.required,
    'orderedFrom',
    'orderedBy',
    'ordered',
    'status',
    'campaigns',
    'delivery',
    'deliveryStatus',
    'deliveryEvents',
    'deliverTo',
    'paymentMethod',
  ],
  properties: {
    ...defaultSchemaEntries.properties!,
    orderedFrom: {
      type: 'string',
      format: 'uuid',
    },
    orderedBy: {
      type: 'string',
      format: 'uuid',
    },
    ordered: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['product', 'quantity'],
        properties: {
          product: orderProductSchema as any,
          quantity: {
            type: 'integer',
            minimum: 1,
          },
        },
      },
    },
    status: {
      type: 'string',
      enum: Object.values(OrderStatus),
    },
    campaigns: {
      type: 'array',
      items: campaignSchema,
    },
    delivery: deliverySchema,
    deliveryTracking: {
      // @ts-ignore the typings are wrong
      type: ['object', 'null'],
      additionalProperties: false,
      properties: {
        trackingId: {
          type: 'string',
          maxLength: 255,
        },
        courierSlug: {
          type: 'string',
          maxLength: 255,
        },
      },
    },
    deliveryStatus: {
      type: 'string',
      enum: Object.values(DeliveryStatus),
      default: DeliveryStatus.UNKNOWN,
    },
    deliveredOn: {
      // @ts-ignore the typings are wrong
      type: ['string', 'null'],
      format: 'date-time',
    },
    deliveryEvents: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['timestamp'],
        properties: {
          timestamp: {
            type: 'string',
            format: 'date-time',
          },
          rawStatus: {
            // @ts-ignore the typings are wrong
            type: ['string', 'null'],
            maxLength: 1023,
          },
          rawDescription: {
            // @ts-ignore the typings are wrong
            type: ['string', 'null'],
            maxLength: 1023,
          },
        },
      },
    },
    deliverTo: addressSchema as any,
    paymentMethod: {
      type: 'string',
      enum: Object.values(PaymentMethodNames),
      default: PaymentMethodNames.CREDIT_CARD,
    },
    buyerNote: {
      // @ts-ignore the typings are wrong
      type: ['string', 'null'],
      maxLength: 1023,
    },
    // This field is calculated on the server-side using the price and discount. Use this when sorting and filtering.
    calculatedTotal: {
      type: 'number',
      exclusiveMinimum: 0,
    },
  },
};

export interface OrderItem {
  // We want to store a variant of the actual product, so if the product is modified they can still see the exact thing that was ordered
  product: OrderProduct;
  quantity: number;
}

export interface DeliveryEvent {
  timestamp: string;
  rawStatus?: string;
  rawDescription?: string;
}

export interface Order extends DefaultSchema {
  orderedFrom: string;
  orderedBy: string;
  ordered: OrderItem[];
  status: OrderStatus;
  campaigns: Campaign[];
  delivery: Delivery;
  deliveryTracking?: {
    trackingId: string;
    courierSlug: string;
  };
  deliveredOn?: string;
  deliveryStatus: DeliveryStatus;
  deliveryEvents: DeliveryEvent[];
  deliverTo: Address;
  paymentMethod: PaymentMethodNames;
  buyerNote?: string;
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

    setDeliveryTracking: (
      orderId: string,
      deliveryTracking: Order['deliveryTracking'],
      params?: Params
    ) => {
      return crudMethods.patch(orderId, { deliveryTracking }, params);
    },

    validate: (data: Order, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },

    OrderStatus,
    DeliveryStatus,
    orderStatusColor,
    schema,
  };
};
