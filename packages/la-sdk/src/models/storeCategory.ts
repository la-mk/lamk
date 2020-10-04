import merge from 'lodash/merge';
import { Application, Params } from '@feathersjs/feathers';
import { schema as categorySchema, Category } from './category';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import { JSONSchemaType } from 'ajv';

export const schema: JSONSchemaType<StoreCategory> = {
  type: 'object',
  additionalProperties: false,
  required: [
    ...categorySchema.required,
    'forStore',
  ],
  properties: {
    ...categorySchema.properties!,
    forStore: {
      type: 'string',
      format: 'uuid',
    },
  }
}

export interface StoreCategory extends Category {
  forStore: string;
}

export const getStoreCategorySdk = (client: Application) => {
  const crudMethods = getCrudMethods<
    OmitServerProperties<StoreCategory>,
    StoreCategory
  >(client, 'storeCategories');

  return {
    ...crudMethods,

    findForStore: (storeId: string, params?: Params) => {
      const options = {};
      merge(options, params, { query: { forStore: storeId } });
      return crudMethods.find(options);
    },

    validate: (data: StoreCategory, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },
  };
};
