import merge from 'lodash/fp/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';

export interface Product {
  _id: string;
  soldBy: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  description?: string;
}

export const getProductSdk = (client: Application) => {
  const crudMethods = getCrudMethods(client, 'products');
  return {
    ...crudMethods,

    findForStore: (storeId: string, params?: Params) => {
      const options = merge({ query: { soldBy: storeId } }, params);
      return crudMethods.find(options);
    },

    validate: (data: Product, considerRequired = true) => {
      if (!data.images) {
        return { logo: 'Logo is missing' };
      }
    },
    validateSingle: (val: any, selector: string) => {
      if (!val) {
        return 'xxx is required';
      }
    },
  };
};
