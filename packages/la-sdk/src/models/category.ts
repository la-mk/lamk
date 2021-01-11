import { Application } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';
import { JSONSchemaType } from 'ajv';

export const schema: JSONSchemaType<Category> = {
  type: 'object',
  additionalProperties: false,
  required: [...defaultSchemaEntries.required, 'level1', 'level2', 'level3'],
  properties: {
    ...defaultSchemaEntries.properties!,
    level1: {
      type: 'string',
      minLength: 2,
      maxLength: 255,
    },
    level2: {
      type: 'string',
      minLength: 2,
      maxLength: 255,
    },
    level3: {
      type: 'string',
      minLength: 2,
      maxLength: 255,
    },
  },
};

export interface Category extends DefaultSchema {
  level1: string;
  level2: string;
  level3: string;
}

export const getCategorySdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<Category>, Category>(
    client,
    'categories'
  );

  return {
    ...crudMethods,

    validate: (data: Category, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },
    schema,
  };
};
