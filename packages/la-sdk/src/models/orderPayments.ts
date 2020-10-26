import merge from 'lodash/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';
import { JSONSchemaType } from 'ajv';

export enum TransactionStatus {
  APPROVED = 'approved',
  DECLINED = 'declined',
  ERROR = 'error',
}

export const paymentTransactionSchema: JSONSchemaType<PaymentTransaction> = {
  type: 'object',
  additionalProperties: false,
  required: ['status', 'amount', 'date'],
  properties: {
    status: {
      type: 'string',
      enum: Object.values(TransactionStatus),
    },
    amount: {
      type: 'number',
      exclusiveMinimum: 0,
    },
    message: {
      // @ts-ignore the typings are wrong
      type: ['string', 'null'],
      minLength: 2,
      maxLength: 511,
    },
    processorId: {
      // @ts-ignore the typings are wrong
      type: ['string', 'null'],
      minLength: 2,
      maxLength: 63,
    },
    userIp: {
      // @ts-ignore the typings are wrong
      type: ['string', 'null'],
      minLength: 2,
      maxLength: 31,
    },
    date: {
      type: 'string',
      format: 'date-time',
    },
  },
};

export const schema: JSONSchemaType<OrderPayments> = {
  type: 'object',
  additionalProperties: false,
  required: [
    ...defaultSchemaEntries.required,
    'forOrder',
    'transactions',
    'isSuccessful',
  ],
  properties: {
    ...defaultSchemaEntries.properties!,
    forOrder: {
      type: 'string',
      format: 'uuid',
    },
    // We put a very high upper-limit just to not get spammed here.
    transactions: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: paymentTransactionSchema,
    },
    // Calculated field based on all transactions.
    isSuccessful: {
      type: 'boolean',
    },
  },
};

export interface PaymentTransaction {
  status: TransactionStatus;
  amount: number;
  message?: string;
  processorId?: string;
  userIp?: string;
  date: string;
}

export interface OrderPayments extends DefaultSchema {
  forOrder: string;
  transactions: PaymentTransaction[];
  isSuccessful: boolean;
}

export const getOrderPaymentsSdk = (client: Application) => {
  const crudMethods = getCrudMethods<
    OmitServerProperties<OrderPayments>,
    OrderPayments
  >(client, 'orderPayments');

  return {
    ...crudMethods,
    findForOrder: (orderId: string, params?: Params) => {
      const options = {};
      merge(options, params, { query: { forOrder: orderId } });
      return crudMethods.find(options);
    },

    validate: (data: OrderPayments, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },

    TransactionStatus,
    schema,
  };
};
