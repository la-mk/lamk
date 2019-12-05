import merge from 'lodash/fp/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils/utils';
import { validate, validateSingle } from '../utils/modelUtils';
import v8n from 'v8n';

export const schema = {
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
      const options = merge({ query: { forStore: storeId } }, params);
      return categoriesPerStoreCrudMethods.find(options);
    },

    validate: (data: Category, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },
  };
};
