import merge from 'lodash/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import v8n from 'v8n';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';

export const schema = {
 ...defaultSchemaEntries,
  ownedBy: v8n().id(),
  name: v8n()
    .string()
    .minLength(2)
    .maxLength(511),
  slug: v8n()
    .string()
    .minLength(2)
    .maxLength(511),
  color: v8n().string().minLength(2).maxLength(31),
  slogan: v8n().optional(v8n().string().minLength(2).maxLength(255)),
  customDomain: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(1023),
    true,
  ),
  company: v8n().optional(v8n().schema({
    companyName: v8n()
      .string()
      .minLength(2)
      .maxLength(511),
    companyAddress: v8n()
      .string()
      .minLength(2)
      .maxLength(1023),
    registryNumber: v8n()
      .string()
      .minLength(2)
      .maxLength(127),
    taxNumber: v8n()
      .string()
      .minLength(2)
      .maxLength(127),
  })),
  contact: v8n().optional(v8n().schema({
    email: v8n()
      .string()
      .minLength(4)
      .maxLength(1023),
    phoneNumber: v8n()
      .string()
      .minLength(4)
      .maxLength(63),
    alternatePhoneNumber: v8n().optional(
      v8n()
        .string()
        .minLength(4)
        .maxLength(63),
      true,
    ),
  })),
  logo: v8n()
    .string()
    .minLength(2)
    .maxLength(4095),
  isPublished: v8n().boolean(),
};

export interface Store extends DefaultSchema {
  ownedBy: string;
  name: string;
  slug: string;
  color: string;
  slogan?: string;
  customDomain?: string;
  company?: {
    companyName: string;
    companyAddress: string;
    registryNumber: string;
    taxNumber: string;
  };
  contact?: {
    email: string;
    phoneNumber: string;
    alternatePhoneNumber?: string;
  };
  logo: string;
  isPublished: boolean;
}

export const getStoreSdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<Store>, Store>(
    client,
    'stores',
  );
  return {
    ...crudMethods,

    findOwned: (userId: string, params?: Params) => {
      const options = {};
      merge(options, params, { query: { ownedBy: userId } } );
      return crudMethods.find(options);
    },

    getBySlug: (slug: string, params?: Params) => {
      const options = {};
      merge(options, params, { query: { slug } } );
      return crudMethods.find(options).then(resp => {
        if (resp.total <= 0) {
          return null;
        }

        if (resp.total > 1) {
          throw new Error('Ambiguous store slug provided.');
        }

        return resp.data[0] as Store;
      });
    },

    validate: (data: Store, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },
  };
};
