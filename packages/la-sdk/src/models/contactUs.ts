import { Application } from '@feathersjs/feathers';
import { validate, validateSingle } from '../utils/validation';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';
import { JSONSchemaType } from 'ajv';

export const schema: JSONSchemaType<ContactUs> = {
  type:  'object',
  additionalProperties: false,
  required: [...defaultSchemaEntries.required, 'email', 'name', 'message'],
  properties: {
    ...defaultSchemaEntries.properties!,
    email: {
      type: 'string',
      format: 'email',
    },
    name: {
      type: 'string',
      minLength: 2,
      maxLength: 255
    },
    message: {
      type: 'string',
      minLength: 2,
      maxLength: 511
    },
  }
}

export interface ContactUs extends DefaultSchema {
  email: string;
  name: string;
  message: string;
}

export const getContactUsSdk = (_client: Application) => {
  return {
    validate: (data: ContactUs, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },
  };
};
