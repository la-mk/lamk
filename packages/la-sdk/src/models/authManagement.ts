import { Application } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';
import pick from 'lodash/pick';
import { JSONSchemaType } from 'ajv';

export const schema: JSONSchemaType<AuthManagement> = {
  type: 'object',
  additionalProperties: false,
  required: [...defaultSchemaEntries.required, 'email'],
  properties: {
    ...defaultSchemaEntries.properties!,
    email: {
      type: 'string',
      format: 'email',
    },
    verifyToken: {
      nullable: true,
      type: 'string',
      minLength: 8,
      maxLength: 255,
    },
    verifyTokenCreatedAt: {
      nullable: true,
      type: 'string',
      format: 'date-time',
    },
    resetToken: {
      nullable: true,
      type: 'string',
      minLength: 8,
      maxLength: 255,
    },
    resetTokenCreatedAt: {
      nullable: true,
      type: 'string',
      format: 'date-time',
    },
  },
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

    resetPassword: (email: string, storeId?: string) => {
      // The actual tokens are created on the server side, so we just send one so we know what we want to patch
      return crudMethods.patch(
        null,
        { resetToken: '!' },
        { query: { email, storeId } }
      );
    },

    validate: (data: AuthManagement, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },
    schema,
  };
};
