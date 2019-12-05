import merge from 'lodash/fp/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils/utils';
import { validate, validateSingle } from '../utils/modelUtils';
import v8n from 'v8n';

export const schema = {
  forStore: v8n()
    .string()
    .minLength(2)
    .maxLength(63),
  method: v8n().oneOf(['pickup', 'cargo-pickup', 'door-to-door']),
  price: v8n()
    .number()
    .positive(),
  freeDeliveryOver: v8n()
    .number()
    .positive(),
};

export interface Delivery {
  _id: string;
  forStore: string;
  method: 'pickup' | 'cargo-pickup' | 'door-to-door';
  price: number;
  freeDeliveryOver: number;
  createdAt: string;
  modifiedAt: string;
}

export const getDeliverySdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<Delivery>, Delivery>(
    client,
    'deliveries',
  );

  return {
    ...crudMethods,

    findForStore: (storeId: string, params?: Params) => {
      const options = merge({ query: { forStore: storeId } }, params);
      return crudMethods.find(options);
    },

    validate: (data: Delivery, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },
  };
};
