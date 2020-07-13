import { Application } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import v8n from 'v8n';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';
import pick from 'lodash/pick';

export const schema = {
  ...defaultSchemaEntries,
  email: v8n().email(),
  verifyToken: v8n().optional(
    v8n()
      .string()
      .minLength(8)
      .maxLength(255),
    true
  ),
  verifyTokenCreatedAt: v8n().optional(v8n().datetime(), true),
  resetToken: v8n().optional(
    v8n()
      .string()
      .minLength(8)
      .maxLength(255),
    true
  ),
  resetTokenCreatedAt: v8n().optional(v8n().datetime(), true),
};

export interface AuthManagement extends DefaultSchema {
  email: string;
  verifyToken?: string;
  verifyTokenCreatedAt?: string;
  resetToken?: string;
  resetTokenCreatedAt?: string;
}

export const getAuthManagementSdk = (client: Application) => {
  const crudMethods = pick(
    getCrudMethods<OmitServerProperties<AuthManagement>, AuthManagement>(
      client,
      'authManagement'
    ),
    ['patch']
  );

  return {
    ...crudMethods,

    resetPassword: (email: string) => {
      // The actual tokens are created on the server side, so we just send one so we know what we want to patch
      crudMethods.patch(null, {resetToken: '!'}, { email });
    },

    validate: (data: AuthManagement, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },
  };
};
