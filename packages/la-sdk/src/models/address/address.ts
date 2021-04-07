import merge from 'lodash/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../../setup';
import { OmitServerProperties } from '../../utils';
import { validate, validateSingle } from '../../utils/validation';
import { defaultSchemaEntries, DefaultSchema } from '../../internal-utils';
import { JSONSchemaType } from 'ajv';

// @ts-ignore the typings are wrong
export const schema: JSONSchemaType<Address> = {
  type: 'object',
  additionalProperties: false,
  // All of these are created on the server and optional for the client.
  required: [
    ...defaultSchemaEntries.required,
    'addressFor',
    'name',
    'country',
    'city',
    'zip',
    'street',
    'person',
    'phoneNumber',
  ],
  properties: {
    ...defaultSchemaEntries.properties!,
    addressFor: {
      type: 'string',
      format: 'uuid',
    },
    name: {
      type: 'string',
      minLength: 2,
      maxLength: 511,
    },
    country: {
      type: 'string',
      minLength: 2,
      maxLength: 255,
      enum: ['MK'],
      default: 'MK',
    },
    region: {
      type: ['string', 'null'],
      minLength: 2,
      maxLength: 255,
    },
    city: {
      type: 'string',
      minLength: 2,
      maxLength: 255,
    },
    zip: {
      type: 'string',
      minLength: 2,
      maxLength: 31,
    },
    street: {
      type: 'string',
      minLength: 2,
      maxLength: 255,
    },
    person: {
      type: 'string',
      minLength: 2,
      maxLength: 255,
    },
    phoneNumber: {
      type: 'string',
      minLength: 2,
      maxLength: 31,
    },
  },
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
    schema,
  };
};
