import merge from 'lodash/fp/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils/utils';
import { validate, validateSingle } from '../utils/modelUtils';
import v8n from 'v8n';

export const schema = {
  soldBy: v8n().string().minLength(2).maxLength(63),
  name: v8n().string().minLength(2).maxLength(511),
  price: v8n().number().positive(),
  images: v8n().every.string().minLength(2).maxLength(4095),
  category: v8n().string().minLength(2).maxLength(511),
  description: v8n().optional(v8n().string().minLength(2).maxLength(2047)),
}

export interface Product {
  _id: string;
  soldBy: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  description?: string;
  createdAt: string;
  modifiedAt: string;
}

export const getProductSdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<Product>, Product>(
    client,
    'products',
  );
  return {
    ...crudMethods,

    findForStore: (storeId: string, params?: Params) => {
      const options = merge({ query: { soldBy: storeId } }, params);
      return crudMethods.find(options);
    },

    validate: (data: Product, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },
  };
};
