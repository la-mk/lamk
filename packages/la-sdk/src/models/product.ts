import merge from 'lodash/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import v8n from 'v8n';
import pick from 'lodash/pick';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';

export enum ProductUnit {
  ITEM = 'item',
  PACK = 'pack',
  M2 = 'm2',
  M = 'm',
  CM = 'cm',
  MM = 'mm',
  KG = 'kg',
  G = 'g',
}

export const schema = {
  ...defaultSchemaEntries,
  soldBy: v8n().id(),
  name: v8n()
    .string()
    .minLength(2)
    .maxLength(255),
  unit: v8n().oneOf(Object.values(ProductUnit)),
  price: v8n()
    .number(false)
    .positive(),
  // Discount is always a value in the base currency, even if we allow the user to input in % (we can just convert to a currency value).
  discount: v8n().optional(
    v8n()
      .number(false)
      .positive()
  ),
  // This field is calculated on the server-side using the price and discount. Use this when sorting and filtering.
  calculatedPrice: v8n().optional(
    v8n()
      .number(false)
      .positive()
  ),
  images: v8n()
    .maxLength(10)
    .every.string()
    .every.minLength(2)
    .every.maxLength(2047),
  category: v8n()
    .string()
    .minLength(2)
    .maxLength(511),
  description: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(4095),
    true
  ),
  sku: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(255),
    true
  ),
  stock: v8n().optional(
    v8n()
      .number()
      .not.negative()
  ),
  groups: v8n()
    .maxLength(10)
    .every.string()
    .every.minLength(2)
    .every.maxLength(127),
};

export interface Product extends DefaultSchema {
  soldBy: string;
  name: string;
  unit: ProductUnit;
  price: number;
  discount?: number;
  calculatedPrice: number;
  images: string[];
  category: string;
  description?: string;
  sku?: string;
  stock?: number;
  groups: string[];
}

export interface ProductSet {
  setTag: ProductSetTag;
  data?: Product[];
  error?: Error;
  filter?: { query: { [key: string]: any } };
}

export interface ProductSetTag {
  name: string;
  value?: string;
}

const getQueryForSet = (productSet: ProductSetTag) => {
  switch (productSet.name) {
    case 'category':
      return {
        category: productSet.value,
      };

    case 'latest': {
      return {
        $sort: {
          createdAt: -1,
        },
      };
    }

    default: {
      return {};
    }
  }
};

export const getProductSdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<Product>, Product>(
    client,
    'products'
  );

  const searchCrudMethods = pick(getCrudMethods<any, any>(client, 'search'), [
    'find',
  ]);

  return {
    ...crudMethods,

    findForStore: (storeId: string, params?: Params) => {
      // If the user is searching, hit the search service, otherwise go to the products service directly.
      if (params?.query?.search) {
        const searchOptions = { query: { $limit: 20, $skip: 0 } };
        merge(searchOptions, params, { query: { storeId, model: 'products' } });

        return searchCrudMethods.find(searchOptions);
      }

      const options = {};
      merge(options, params, { query: { soldBy: storeId } });
      return crudMethods.find(options);
    },

    getProductSetsForStore: (
      storeId: string,
      productSetTags: ProductSetTag[],
      params?: Params
    ): Promise<ProductSet[]> => {
      return Promise.all(
        productSetTags.map(setTag => {
          const queryForSet = getQueryForSet(setTag);

          if (!queryForSet) {
            return Promise.resolve({
              setTag,
              error: new Error('Set not found'),
            } as ProductSet);
          }

          const options = {query: { $limit: 10 }};
          merge(
            options,
            params,
            { query: { soldBy: storeId, ...queryForSet } },
          );

          return crudMethods
            .find(options)
            .then(res => {
              return { setTag, data: res.data, filter: { query: queryForSet } };
            })
            .catch(err => {
              return { setTag, error: err, filter: { query: queryForSet } };
            });
        })
      );
    },

    validate: (data: Product, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },

    ProductUnit,
  };
};
