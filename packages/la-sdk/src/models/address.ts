import merge from 'lodash/fp/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';

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

    validate: (data: Address, considerRequired = true) => {
      if (!data) {
        return { price: 'Price is missing' };
      }
    },
    validateSingle: (val: any, selector: string) => {
      if (!val) {
        return 'xxx is required';
      }
    },
  };
};
