import merge from 'lodash/fp/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils/utils';
import { validate, validateSingle } from '../utils/modelUtils';
import v8n from 'v8n';

export const schema = {
  aboutUs: v8n().optional(
    v8n().schema({
      description: v8n().optional(
        v8n()
          .string()
          .minLength(2)
          .maxLength(65535),
      ),
    }),
  ),
  landing: v8n().optional(
    v8n().schema({
      banner: v8n().optional(
        v8n()
          .string()
          .minLength(2)
          .maxLength(4095),
      ),
    }),
  ),
};

export interface StoreContents {
  _id: string;
  aboutUs?: {
    description: string;
  };
  landing?: {
    banner?: string;
  };
  createdAt?: string;
  modifiedAt?: string;
}

export const getStoreContentsSdk = (client: Application) => {
  const crudMethods = getCrudMethods<
    OmitServerProperties<StoreContents>,
    StoreContents
  >(client, 'storeContents');

  const findForStore = (storeId: string, params?: Params) => {
    const options = merge({ query: { forStore: storeId } }, params);
    return crudMethods.find(options);
  };

  return {
    ...crudMethods,
    findForStore,
    getAboutUsForStore: (storeId: string, params?: Params) => {
      return findForStore(storeId, params).then(res =>
        res.total > 0 ? res.data[0].aboutUs : undefined,
      );
    },

    getLandingContentForStore: (storeId: string, params?: Params) => {
      return findForStore(storeId, params).then(res =>
        res.total > 0 ? res.data[0].landing : undefined,
      );
    },

    validate: (data: StoreContents, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },
  };
};
