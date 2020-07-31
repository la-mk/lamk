import merge from 'lodash/merge';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';
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

export const attributesSchema = {
  color: v8n().optional(v8n().hexColor(), true),
  size: v8n().optional(
    v8n()
      .string()
      .minLength(1)
      .maxLength(31)
  ),
};

const variantSchema = {
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
  attributes: v8n().optional(v8n().schema(attributesSchema)),
  sku: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(63),
    true
  ),
  stock: v8n().optional(
    v8n()
      .number()
      .not.negative()
  ),
};

export const schema = {
  ...defaultSchemaEntries,
  soldBy: v8n().id(),
  name: v8n()
    .string()
    .minLength(2)
    .maxLength(255),
  unit: v8n().oneOf(Object.values(ProductUnit)),
  images: v8n()
    .maxLength(10)
    .every.string()
    .every.minLength(2)
    .every.maxLength(1023),
  groups: v8n()
    .maxLength(10)
    .every.string()
    .every.minLength(2)
    .every.maxLength(127),
  category: v8n()
    .string()
    .minLength(2)
    .maxLength(255),
  description: v8n().optional(
    v8n()
      .string()
      .minLength(2)
      .maxLength(4095),
    true
  ),

  variants: v8n()
    .minLength(1)
    .maxLength(63)
    .unique('attributes')
    .equalSchema()
    .every.schema(variantSchema),

  // The total stock of all variants
  totalStock: v8n().optional(
    v8n()
      .number()
      .not.negative()
  ),

  // If variants have different prices, this is the minimum
  minPrice: v8n().optional(
    v8n()
      .number(false)
      .positive()
  ),
  // If variants have different prices, this is the maximum, otherwise min and max will be he same.
  maxPrice: v8n().optional(
    v8n()
      .number(false)
      .positive()
  ),

  // Same as min and max price
  minDiscount: v8n().optional(
    v8n()
      .number(false)
      .positive()
  ),
  maxDiscount: v8n().optional(
    v8n()
      .number(false)
      .positive()
  ),

  // Same as min and max price
  minCalculatedPrice: v8n().optional(
    v8n()
      .number(false)
      .positive()
  ),
  maxCalculatedPrice: v8n().optional(
    v8n()
      .number(false)
      .positive()
  ),
};

export const orderProductSchema = omit(
  {
    ...schema,
    ...variantSchema,
  },
  [
    'variants',
    'totalStock',
    'minPrice',
    'maxPrice',
    'minDiscount',
    'maxDiscount',
    'minCalculatedPrice',
    'maxCalculatedPrice',
  ]
);

export interface Attributes {
  color?: string;
  size?: string;
}

export interface Variant {
  price: number;
  calculatedPrice?: number;
  attributes?: Attributes;
  discount?: number;
  sku?: string;
  stock?: number;
  // variantImage?: string;
}

export interface Product extends DefaultSchema {
  soldBy: string;
  name: string;
  unit: ProductUnit;
  category: string;
  groups: string[];
  images: string[];
  description?: string;
  variants: Variant[];
  totalStock?: number;
  minPrice?: number;
  maxPrice?: number;
  minDiscount?: number;
  maxDiscount?: number;
  minCalculatedPrice?: number;
  maxCalculatedPrice?: number;
}

// An order always stores a flattened product and variant combination.
export interface OrderProduct
  extends Omit<
      Product,
      | 'variants'
      | 'totalStock'
      | 'minPrice'
      | 'maxPrice'
      | 'minDiscount'
      | 'maxDiscount'
      | 'minCalculatedPrice'
      | 'maxCalculatedPrice'
    >,
    Variant {}

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

    case 'discounted': {
      return {
        minDiscount: {
          $gt: 0,
        },
      };
    }

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

export const convertToOrderProduct = (
  product: Product,
  attributes?: Attributes
): OrderProduct | null => {
  const variant = getVariantForAttributes(product, attributes);
  if(!variant){
    return null;
  }

  return {
    ...omit(product, [
      'variants',
      'totalStock',
      'minPrice',
      'maxPrice',
      'minDiscount',
      'maxDiscount',
      'minCalculatedPrice',
      'maxCalculatedPrice',
    ]),
    ...variant,
  };
};

export const getVariantForAttributes = (
  product: Product,
  attributes?: Attributes
) => {
  // We return the first variant
  if (!attributes) {
    return product.variants[0];
  }

  const variant = product.variants.find(variant => isEqual(variant.attributes, attributes))
  if(!variant){
    return null;
  }

  return variant;
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

          const options = { query: { $limit: 10 } };
          merge(options, params, {
            query: { soldBy: storeId, ...queryForSet },
          });

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

    getQueryForSet,

    getVariantForAttributes,

    convertToOrderProduct,

    // If the product has at least one attribute, it means it has variants.
    hasVariants: (product?: Product) => {
      return product && Object.keys(product.variants?.[0]?.attributes ?? {}).length > 0
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
