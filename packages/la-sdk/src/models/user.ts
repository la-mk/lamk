import { Application } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils/utils';
import { validate, validateSingle } from '../utils/modelUtils';
import v8n from 'v8n';

export const schema = {
  email: v8n().string().minLength(2).maxLength(511),
  password: v8n().string().minLength(8).maxLength(255),
  firstName: v8n().optional(v8n().string().minLength(2).maxLength(255), true),
  lastName: v8n().optional(v8n().string().minLength(2).maxLength(255), true),
  phoneNumber: v8n().optional(v8n().string().minLength(2).maxLength(31), true),
}

export interface User {
  _id: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  createdAt?: string;
  modifiedAt?: string;
}

export const getUserSdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<User>, User>(
    client,
    'users',
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
