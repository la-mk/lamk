import merge from 'lodash/merge';
import { Application, Params } from '@feathersjs/feathers';
import {schema as categorySchema, Category} from './category';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import v8n from 'v8n';

export const schema = {
  ...categorySchema,
  forStore: v8n()
    .string()
    .minLength(2)
    .maxLength(63),
};

export interface StoreCategory extends Category {
  forStore: string;
}

export const getStoreCategorySdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<StoreCategory>, StoreCategory>(
    client,
    'storeCategories',
  );

  return {
    ...crudMethods,

    findForStore: (storeId: string, params?: Params) => {
      const options = {};
      merge(options, params, { query: { forStore: storeId } });
      return crudMethods.find(options);
    },

    validate: (data: Category, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },
  };
};
