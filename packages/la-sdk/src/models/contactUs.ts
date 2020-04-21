import { Application } from '@feathersjs/feathers';
import { validate, validateSingle } from '../utils/validation';
import v8n from 'v8n';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';

export const schema = {
  ...defaultSchemaEntries,
  email: v8n().email(),
  name: v8n()
    .string()
    .minLength(2)
    .maxLength(255),
  message: v8n()
    .string()
    .minLength(2)
    .maxLength(255),
};

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
