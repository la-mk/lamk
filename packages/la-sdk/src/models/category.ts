import { Application } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import v8n from 'v8n';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';

export const schema = {
 ...defaultSchemaEntries,
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

export interface Category extends DefaultSchema {
  level1: string;
  level2: string;
  level3: string;
}

export const getCategorySdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<Category>, Category>(
    client,
    'categories',
  );

  return {
    ...crudMethods,

    validate: (data: Category, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },
  };
};
