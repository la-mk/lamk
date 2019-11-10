import merge from 'lodash/fp/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils/utils';

export interface Store {
  _id: string;
  ownedBy: string;
  name: string;
  slug: string;
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
      return crudMethods.find(options)
      .then((resp) => {
        if(resp.total <= 0){
          return null;
        }

        if(resp.total > 1){
          throw new Error("Ambiguous store slug provided.")
        }

        return resp.data[0] as Store;
      });
    },

    validate: (data: Store, ignoreRequired = false) => {
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
