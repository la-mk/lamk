import merge from 'lodash/fp/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../../setup';
import { OmitServerProperties } from '../../utils';
import { validate, validateSingle } from '../../utils/validation';
import v8n from 'v8n';

export const schema = {
  // ID is optional as it is autogenerated by server on creation.
  _id: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(63),
    true,
  ),
  addressFor: v8n()
    .string()
    .minLength(2)
    .maxLength(63),
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
    true,
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
  person: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(511),
    true,
  ),
  phoneNumber: v8n()
    .string()
    .minLength(2)
    .maxLength(31),
  // createdAt is optional as it is added by server on creation.
  createdAt: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(63),
    true,
  ),
  modifiedAt: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(63),
    true,
  ),
};

export interface Address {
  _id: string;
  addressFor: string;
  name: string;
  country: string;
  region?: string;
  city: string;
  zip: string;
  street: string;
  person?: string;
  phoneNumber: string;
  createdAt: string;
  modifiedAt: string;
}

export const getAddressSdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<Address>, Address>(
    client,
    'addresses',
  );

  return {
    ...crudMethods,

    findForUser: (userId: string, params?: Params) => {
      const options = merge({ query: { addressFor: userId } }, params);
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
