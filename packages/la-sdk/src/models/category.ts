import merge from 'lodash/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import v8n from 'v8n';

export const schema = {
  // ID is optional as it is autogenerated by server on creation.
  _id: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(63),
    true,
  ),
  level1: v8n()
    .string()
    .minLength(2)
    .maxLength(511),
  level2: v8n()
    .string()
    .minLength(2)
    .maxLength(511),
  level3: v8n()
    .string()
    .minLength(2)
    .maxLength(511),

  // createdAt is optional as it is added by server on creation.
  createdAt: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(63),
    true,
  ),
  modifiedAt: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(63),
    true,
  ),
};

// TODO: Maybe we want to create a separate model for `perStore`.
export const categoriesPerStoreSchema = {
  ...schema,
  forStore: v8n()
    .string()
    .minLength(2)
    .maxLength(63),
};

export interface Category {
  _id: string;
  level1: string;
  level2: string;
  level3: string;
  createdAt: string;
  modifiedAt: string;
}

export interface CategoryForStore extends Category {
  forStore: string;
}

export const getCategorySdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<Category>, Category>(
    client,
    'categories',
  );

  const categoriesPerStoreCrudMethods = getCrudMethods<
    OmitServerProperties<CategoryForStore>,
    CategoryForStore
  >(client, 'categoriesPerStore');

  return {
    ...crudMethods,

    findForStore: (storeId: string, params?: Params) => {
      const options = {};
      merge(options, params, { query: { forStore: storeId } });
      return categoriesPerStoreCrudMethods.find(options);
    },

    validate: (data: Category, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },

    // This is for categoriesForStore
    validatePerStore: (data: Category, ignoreRequired = false) => {
      return validate(categoriesPerStoreSchema, data, ignoreRequired);
    },
    validateSinglePerStore: (val: any, selector: string) => {
      return validateSingle(categoriesPerStoreSchema, val, selector);
    },
  };
};
