import merge from 'lodash/merge';
import { Application, Params, Id } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import v8n from 'v8n';

export enum PaymentMethodNames {
  CREDIT_CARD = 'creditCard',
  PAY_ON_DELIVERY = 'payOnDelivery',
}

export enum PaymentProcessors {
  HALKBANK = 'halkbank',
}

export const paymentMethodSchema = {
  name: v8n().oneOf(Object.values(PaymentMethodNames)),
  processor: v8n().optional(v8n().oneOf(Object.values(PaymentProcessors))),
  clientId: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(63)
  ),
  clientKey: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(63)
  ),
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
  forStore: v8n()
    .string()
    .minLength(2)
    .maxLength(63),

  methods: v8n()
    .minLength(1)
    .unique('name')
    .every.schema(paymentMethodSchema),

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

export interface PaymentMethod {
  name: PaymentMethodNames;
  processor?: PaymentProcessors; // The bank name or service that processees the payment, if applicable
  clientId?: string; // Client Id provided by the processor, if applicable
  clientKey?: string; // Key provided by the processor, if applicable
}

export interface StorePaymentMethods {
  _id: string;
  forStore: string;
  methods: PaymentMethod[];
  createdAt?: string;
  modifiedAt?: string;
}

export interface HashParts {
  hash: string;
  randomString: string;
}

export const getStorePaymentMethodsSdk = (client: Application) => {
  const crudMethods = getCrudMethods<
    OmitServerProperties<StorePaymentMethods>,
    StorePaymentMethods
  >(client, 'storePaymentMethods');

  return {
    ...crudMethods,
    findForStore: (storeId: string, params?: Params) => {
      const options = {};
      merge(options, params, { query: { forStore: storeId } });
      return crudMethods.find(options);
    },

    // If hashParamsVal and methodName are passed, the result is calculated in a custom hook.
    getHashParts: (
      id: Id,
      hashParamsVal: string,
      methodName: string
    ): HashParts => {
      return crudMethods.get(id, {
        query: { hashParamsVal, methodName },
      }) as any;
    },

    validate: (data: StorePaymentMethods, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },

    PaymentMethodNames,
    PaymentProcessors,
  };
};
