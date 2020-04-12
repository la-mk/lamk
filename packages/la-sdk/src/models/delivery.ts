import merge from 'lodash/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import v8n from 'v8n';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';

export enum DeliveryMethods {
  PICKUP = 'pickup',
  CARGO_PICKUP = 'cargo-pickup',
  DOOR_TO_DOOR = 'door-to-door',
}

export const schema = {
 ...defaultSchemaEntries,
  forStore: v8n().id(),
  method: v8n().oneOf(Object.values(DeliveryMethods)),
  price: v8n()
    .number()
    .positive(),
  freeDeliveryOver: v8n()
    .number()
    .positive(),
};

export interface Delivery extends DefaultSchema {
  forStore: string;
  method: DeliveryMethods;
  price: number;
  freeDeliveryOver: number;
}

export const getDeliverySdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<Delivery>, Delivery>(
    client,
    'deliveries',
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
