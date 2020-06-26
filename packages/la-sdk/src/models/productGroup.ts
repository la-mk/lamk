import merge from 'lodash/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import v8n from 'v8n';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';

export const schema = {
  ...defaultSchemaEntries,
  forStore: v8n().id(),
  groupName: v8n()
    .string()
    .minLength(2)
    .maxLength(127),
  // positive also includes 0
  itemCountInGroup: v8n()
    .number()
    .positive(),
};

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
  };
};
