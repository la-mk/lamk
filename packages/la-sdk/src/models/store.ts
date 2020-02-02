import merge from 'lodash/fp/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils/utils';
import { validate, validateSingle } from '../utils/modelUtils';
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
  ownedBy: v8n()
    .string()
    .minLength(2)
    .maxLength(63),
  name: v8n()
    .string()
    .minLength(2)
    .maxLength(511),
  slug: v8n()
    .string()
    .minLength(2)
    .maxLength(511),
  customDomain: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(1023),
    true,
  ),
  company: v8n().schema({
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
  }),
  contact: v8n().schema({
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
  }),
  product: v8n()
    .string()
    .minLength(2)
    .maxLength(63),
  fromStore: v8n()
    .string()
    .minLength(2)
    .maxLength(63),
  quantity: v8n()
    .number()
    .positive(),
  logo: v8n()
    .string()
    .minLength(2)
    .maxLength(4095),
  isPublished: v8n().boolean(),
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

export interface Store {
  _id: string;
  ownedBy: string;
  name: string;
  slug: string;
  customDomain?: string;
  company: {
    companyName: string;
    companyAddress: string;
    registryNumber: string;
    taxNumber: string;
  };
  contact: {
    email: string;
    phoneNumber: string;
    alternatePhoneNumber?: string;
  };
  logo: string;
  isPublished: boolean;
  createdAt: string;
  modifiedAt: string;
}

export const getStoreSdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<Store>, Store>(
    client,
    'stores',
  );
  return {
    ...crudMethods,

    findOwned: (userId: string, params?: Params) => {
      const options = merge({ query: { ownedBy: userId } }, params);
      return crudMethods.find(options);
    },

    getBySlug: (slug: string, params?: Params) => {
      const options = merge({ query: { slug } }, params);
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
