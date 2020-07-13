import { Application } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import v8n from 'v8n';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';

export const schema = {
  ...defaultSchemaEntries,
  email: v8n().email(),
  password: v8n()
    .string()
    .minLength(8)
    .maxLength(255),
  isEmailVerified: v8n()
    .boolean(),
  firstName: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(255),
    true
  ),
  lastName: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(255),
    true
  ),
  phoneNumber: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(31),
    true
  ),
};

export interface User extends DefaultSchema {
  email: string;
  isEmailVerified: boolean;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

export const getUserSdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<User>, User>(
    client,
    'users'
  );
  return {
    ...crudMethods,
    validate: (data: User, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },
  };
};
