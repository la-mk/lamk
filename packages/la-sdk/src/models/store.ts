import merge from 'lodash/fp/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils/utils';
import { validate, validateSingle } from '../utils/modelUtils';
import v8n from 'v8n';

export const schema = {
  ownedBy: v8n().string().minLength(2).maxLength(63),
  name: v8n().string().minLength(2).maxLength(511),
  slug: v8n().string().minLength(2).maxLength(511),
  logo: v8n().string().minLength(2).maxLength(4095),
  isPublished: v8n().boolean(),
}

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
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },
  };
};
