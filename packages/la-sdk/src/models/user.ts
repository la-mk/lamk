import { Application } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';
import { JSONSchemaType } from 'ajv';

export const schema: JSONSchemaType<User> = {
  type: 'object',
  additionalProperties: false,
  required: [
    ...defaultSchemaEntries.required,
    'email',
    'password',
    'isEmailVerified',
  ],
  properties: {
    ...defaultSchemaEntries.properties!,
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
      maxLength: 255,
    },
    isEmailVerified: {
      type: 'boolean',
      default: false,
    },
    firstName: {
      // @ts-ignore the typings are wrong
      type: ['string', 'null'],
      minLength: 2,
      maxLength: 255,
    },
    lastName: {
      // @ts-ignore the typings are wrong
      type: ['string', 'null'],
      minLength: 2,
      maxLength: 255,
    },
    phoneNumber: {
      // @ts-ignore the typings are wrong
      type: ['string', 'null'],
      minLength: 2,
      maxLength: 31,
    },
  },
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
    schema,
  };
};
