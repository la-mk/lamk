import merge from 'lodash/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../../setup';
import { OmitServerProperties } from '../../utils';
import { validate, validateSingle } from '../../utils/validation';
import v8n from 'v8n';
import { defaultSchemaEntries, DefaultSchema } from '../../internal-utils';

export const schema = {
  ...defaultSchemaEntries,
  addressFor: v8n().id(),
  name: v8n()
    .string()
    .minLength(2)
    .maxLength(511),
  country: v8n()
    .string()
    .minLength(2)
    .maxLength(255),
  region: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(511),
    true
  ),
  city: v8n()
    .string()
    .minLength(2)
    .maxLength(255),
  zip: v8n()
    .string()
    .minLength(2)
    .maxLength(31),
  street: v8n()
    .string()
    .minLength(2)
    .maxLength(255),
  person: v8n()
    .string()
    .minLength(2)
    .maxLength(511),
  phoneNumber: v8n()
    .string()
    .minLength(2)
    .maxLength(31),
};

export interface Address extends DefaultSchema {
  addressFor: string;
  name: string;
  country: string;
  region?: string;
  city: string;
  zip: string;
  street: string;
  person: string;
  phoneNumber: string;
}

export const getAddressSdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<Address>, Address>(
    client,
    'addresses'
  );

  return {
    ...crudMethods,

    findForUser: (userId: string, params?: Params) => {
      const options = {};
      merge(options, params, { query: { addressFor: userId } });
      return crudMethods.find(options);
    },

    validate: (data: Address, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },
  };
};
