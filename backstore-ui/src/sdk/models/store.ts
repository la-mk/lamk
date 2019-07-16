import merge from 'lodash/fp/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';

export interface Store {
  _id: string;
  ownedBy: string;
  name: string;
  slug: string;
  logo: string;
  isPublished: boolean;
}

export const getStoreSdk = (client: Application) => {
  const crudMethods = getCrudMethods(client, 'stores');
  return {
    ...crudMethods,

    findForUser: (userId: string, params?: Params) => {
      return crudMethods.find(merge({ query: { ownedBy: userId } }, params));
    },

    validate: (data: Store, considerRequired = true) => {
      if (!data.logo) {
        return { logo: 'Logo is missing' };
      }
    },
    validateSingle: (val: any, selector: string) => {
      if (!val) {
        return 'xx is required';
      }
    },
  };
};
