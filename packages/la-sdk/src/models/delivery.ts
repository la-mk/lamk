import merge from 'lodash/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';
import { JSONSchemaType } from 'ajv';

export enum DeliveryMethods {
  PICKUP = 'pickup',
  CARGO_PICKUP = 'cargo-pickup',
  DOOR_TO_DOOR = 'door-to-door',
}

export const schema: JSONSchemaType<Delivery> = {
  type:  'object',
  additionalProperties: false,
  required: [...defaultSchemaEntries.required, 'forStore', 'method', 'price', 'freeDeliveryOver'],
  properties: {
    ...defaultSchemaEntries.properties!,
    forStore: {
      type: 'string',
      format: 'uuid'
    },
    method: {
      type: 'string',
      oneOf: Object.values(DeliveryMethods) as any,
    },
    price: {
      type: 'number',
      minimum: 0
    },
    freeDeliveryOver: {
      type: 'number',
      minimum: 0
    }
  }
}

export interface Delivery extends DefaultSchema {
  forStore: string;
  method: DeliveryMethods;
  price: number;
  freeDeliveryOver: number;
}

export const getDeliverySdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<Delivery>, Delivery>(
    client,
    'deliveries'
  );

  return {
    ...crudMethods,

    findForStore: (storeId: string, params?: Params) => {
      const options = {};
      merge(options, params, { query: { forStore: storeId } });
      return crudMethods.find(options);
    },

    validate: (data: Delivery, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },

    DeliveryMethods,
  };
};
