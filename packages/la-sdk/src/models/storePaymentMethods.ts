import merge from 'lodash/merge';
import { Application, Params, Id } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';
import { JSONSchemaType } from 'ajv';

export enum PaymentMethodNames {
  CREDIT_CARD = 'creditCard',
  PAY_ON_DELIVERY = 'payOnDelivery',
}

export enum PaymentProcessors {
  HALKBANK = 'halkbank',
}

export const paymentMethodSchema: JSONSchemaType<PaymentMethod> = {
  type: 'object',
  additionalProperties: false,
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      enum: Object.values(PaymentMethodNames)
    },
    processor: {
      nullable: true,
      type: 'string',
      enum: Object.values(PaymentProcessors)
    },
    clientId: {
      nullable: true,
      type: 'string',
      minLength: 2,
      maxLength: 63
    },
    clientKey: {
      nullable: true,
      type: 'string',
      minLength: 2,
      maxLength: 63
    },
    clientUsername: {
      nullable: true,
      type: 'string',
      minLength: 2,
      maxLength: 63
    },
    clientPassword: {
      nullable: true,
      type: 'string',
      minLength: 2,
      maxLength: 63
    },
  }
}

export const schema: JSONSchemaType<StorePaymentMethods> = {
  type: 'object',
  additionalProperties: false,
  required: [
    ...defaultSchemaEntries.required,
    'forStore',
    'methods'
  ],
  properties: {
    ...defaultSchemaEntries.properties!,
    forStore: {
      type: 'string',
      format: 'uuid',
    },
    methods: {
      type: 'array',
      minLength: 1,
      items: paymentMethodSchema,
      uniqueOn: '/name'
    }
  }
};

export interface PaymentMethod {
  name: PaymentMethodNames;
  processor?: PaymentProcessors; // The bank name or service that processees the payment, if applicable
  clientId?: string; // Client Id provided by the processor, if applicable
  clientKey?: string; // Key provided by the processor, if applicable
  clientUsername?: string; // Client username provided by the processor, if applicable
  clientPassword?: string; // Client password provided by the processor, if applicable
}

export interface StorePaymentMethods extends DefaultSchema {
  forStore: string;
  methods: PaymentMethod[];
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
    ): Promise<HashParts> => {
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
