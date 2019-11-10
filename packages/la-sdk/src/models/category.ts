import merge from 'lodash/fp/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils/utils';

export interface Category {
  _id: string;
  level1: string;
  level2: string;
  level3: string;
  createdAt: string;
  modifiedAt: string;
}

export interface CategoryForStore extends Category {
  forStore: string;
}

export const getCategorySdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<Category>, Category>(
    client,
    'categories',
  );

  const categoriesPerStoreCrudMethods = getCrudMethods<OmitServerProperties<CategoryForStore>, CategoryForStore>(
    client,
    'categoriesPerStore',
  );

  return {
    ...crudMethods,

    findForStore: (storeId: string, params?: Params) => {
      const options = merge({ query: { forStore: storeId } }, params);
      return categoriesPerStoreCrudMethods.find(options);
    },

    validate: (data: Category, ignoreRequired = false) => {
      if (!data.level1) {
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
