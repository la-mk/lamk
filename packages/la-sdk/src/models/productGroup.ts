import merge from 'lodash/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';
import { JSONSchemaType } from 'ajv';


export const schema: JSONSchemaType<ProductGroup> = {
  type: 'object',
  additionalProperties: false,
  required: [
    ...defaultSchemaEntries.required,
    'forStore',
    'groupName',
    'itemCountInGroup',
  ],
  properties: {
    ...defaultSchemaEntries.properties!,
    forStore: {
      type: 'string',
      format: 'uuid',
    },
    groupName: {
      type: 'string',
      minLength: 2,
      maxLength: 127
    },
    itemCountInGroup: {
      type: 'integer',
      minimum: 0
    }
  }
}

export interface ProductGroup extends DefaultSchema {
  forStore: string;
  groupName: string;
  itemCountInGroup: number;
}

export const getProductGroupSdk = (client: Application) => {
  const crudMethods = getCrudMethods<
    OmitServerProperties<ProductGroup>,
    ProductGroup
  >(client, 'productGroups');

  return {
    ...crudMethods,

    findForStore: (storeId: string, params?: Params) => {
      const options = {};
      merge(options, params, { query: { forStore: storeId } });

      return crudMethods.find(options);
    },

    validate: (data: ProductGroup, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },
    schema
  };
};
