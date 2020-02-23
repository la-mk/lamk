import merge from 'lodash/fp/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils/utils';
import { validate, validateSingle } from '../utils/modelUtils';
import v8n from 'v8n';
import pick from 'lodash/pick';

export const schema = {
  // ID is optional as it is autogenerated by server on creation.
  _id: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(63),
    true,
  ),
  soldBy: v8n()
    .string()
    .minLength(2)
    .maxLength(63),
  name: v8n()
    .string()
    .minLength(2)
    .maxLength(255),
  price: v8n()
    .number(false)
    .positive(),
  unit: v8n().oneOf(['item', 'pack', 'm2', 'm', 'cm', 'mm', 'kg', 'g']),
  images: v8n()
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
    true,
  ),
  sku: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(511),
    true,
  ),
  stock: v8n().optional(
    v8n()
      .number()
      .not.negative(),
  ),
  // createdAt is optional as it is added by server on creation.
  createdAt: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(63),
    true,
  ),
  modifiedAt: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(63),
    true,
  ),
};

export interface Product {
  _id: string;
  soldBy: string;
  name: string;
  price: number;
  unit: string;
  images: string[];
  category: string;
  description?: string;
  sku: string;
  stock?: number;
  createdAt: string;
  modifiedAt: string;
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
  }
};

export const getProductSdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<Product>, Product>(
    client,
    'products',
  );

  const searchCrudMethods = pick(getCrudMethods<any, any>(client, 'search'), [
    'find',
  ]);

  return {
    ...crudMethods,

    findForStore: (storeId: string, params?: Params) => {
      // If the user is searching, hit the search service, otherwise go to the products service directly.
      if (params?.query?.search) {
        const searchOptions = merge(
          { query: { storeId, model: 'products', $limit: 20, $skip: 0 } },
          params,
        );

        return searchCrudMethods.find(searchOptions);
      }

      const options = merge({ query: { soldBy: storeId } }, params);
      return crudMethods.find(options);
    },

    getProductSetsForStore: (
      storeId: string,
      productSetTags: ProductSetTag[],
      params?: Params,
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

          const options = merge(
            { query: { soldBy: storeId, $limit: 10, ...queryForSet } },
            params,
          );

          return crudMethods
            .find(options)
            .then(res => {
              return { setTag, data: res.data, filter: { query: queryForSet } };
            })
            .catch(err => {
              return { setTag, error: err, filter: { query: queryForSet } };
            });
        }),
      );
    },

    validate: (data: Product, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },
  };
};
