import merge from 'lodash/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import v8n from 'v8n';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';

export enum TransactionStatus {
  APPROVED = 'approved',
  DECLINED = 'declined',
  ERROR = 'error',
}

export const paymentTransactionSchema = {
  status: v8n().oneOf(Object.values(TransactionStatus)),
  amount: v8n()
    .number()
    .positive(),
  message: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(511)
  ),
  processorId: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(63)
  ),
  userIp: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(31)
  ),
  date: v8n().datetime(),
};

export const schema = {
  ...defaultSchemaEntries,
  forOrder: v8n().id(),
  // We put a very high upper-limit just to not get spammed here.
  transactions: v8n()
    .minLength(1)
    .maxLength(100)
    .every.schema(paymentTransactionSchema),
  // Calculated field based on all transactions.
  isSuccessful: v8n().boolean(),
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
  };
};
