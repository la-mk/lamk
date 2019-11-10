import merge from 'lodash/fp/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils/utils';

export interface Product {
  _id: string;
  soldBy: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  description?: string;
  createdAt: string;
  modifiedAt: string;
}

export const getProductSdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<Product>, Product>(
    client,
    'products',
  );
  return {
    ...crudMethods,

    findForStore: (storeId: string, params?: Params) => {
      const options = merge({ query: { soldBy: storeId } }, params);
      return crudMethods.find(options);
    },

    validate: (data: Product, ignoreRequired = false) => {
      return;
      // if (!data.images) {
      //   return { images: 'No images uploaded' };
      // }
    },
    validateSingle: (val: any, selector: string) => {
      if (!val) {
        return 'xxx is required';
      }
    },
  };
};
