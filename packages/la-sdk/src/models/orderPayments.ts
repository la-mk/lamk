import merge from 'lodash/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import v8n from 'v8n';

export enum TransactionStatus {
  APPROVED = 'approved',
  DECLINED = 'declined',
  ERROR = 'error',
}

export const paymentTransactionSchema = {
  status: v8n().oneOf(Object.values(TransactionStatus)),
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
  date: v8n()
    .string()
    .minLength(2)
    .maxLength(63),
};

export const schema = {
  // ID is optional as it is autogenerated by server on creation.
  _id: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(63),
    true
  ),
  forOrder: v8n()
    .string()
    .minLength(2)
    .maxLength(63),
  // We put a very high upper-limit just to not get spammed here.
  transactions: v8n().minLength(1).maxLength(100).every.schema(paymentTransactionSchema),
  // Calculated field based on all transactions.
  isSuccessful: v8n().boolean(),
  // createdAt is optional as it is added by server on creation.
  createdAt: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(63),
    true
  ),
  modifiedAt: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(63),
    true
  ),
};

export interface PaymentTransaction {
  status: TransactionStatus;
  message?: string;
  processorId?: string;
  userIp?: string;
  date: string;
}

export interface OrderPayments {
  _id: string;
  forOrder: string;
  transactions: PaymentTransaction[];
  isSuccessful: boolean;
  createdAt?: string;
  modifiedAt?: string;
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
