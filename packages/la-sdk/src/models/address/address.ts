import merge from 'lodash/fp/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../../setup';
import { OmitServerProperties } from '../../utils/utils';
import { validate, validateSingle } from '../../utils/modelUtils';
import v8n from 'v8n';

const schema = {
  addressFor: v8n().string().maxLength(65535),
  name: v8n().string().maxLength(511),
  country: v8n().string().maxLength(255),
  region: v8n().optional(v8n().string().maxLength(511)),
  city: v8n().string().maxLength(255),
  zip: v8n().string().maxLength(63),
  street: v8n().string().maxLength(255),
  person: v8n().optional(v8n().string().maxLength(511)),
  phoneNumber: v8n().string().maxLength(255),
}

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
