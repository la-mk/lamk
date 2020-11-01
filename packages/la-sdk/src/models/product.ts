import merge from 'lodash/merge';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import pick from 'lodash/pick';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';
import { omitBy, isNil } from 'lodash';
import { JSONSchemaType } from 'ajv';

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

export const attributesSchema: JSONSchemaType<Attributes> = {
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    color: {
      // @ts-ignore the typings are wrong
      type: ['string', 'null'],
      format: 'hexColor',
    },
    size: {
      // @ts-ignore the typings are wrong
      type: ['string', 'null'],
      minLength: 1,
      maxLength: 31,
    },
  },
};

export const variantSchema: JSONSchemaType<Variant> = {
  type: 'object',
  additionalProperties: false,
  required: ['price'],
  properties: {
    price: {
      type: 'number',
      exclusiveMinimum: 0,
      default: 0,
    },
    // Discount is always a value in the base currency, even if we allow the user to input in % (we can just convert to a currency value).
    discount: {
      // @ts-ignore the typings are wrong
      type: ['number', 'null'],
      minimum: 0,
    },
    // This field is calculated on the server-side using the price and discount. Use this when sorting and filtering.
    calculatedPrice: {
      // @ts-ignore the typings are wrong
      type: ['number', 'null'],
      exclusiveMinimum: 0,
    },
    attributes: attributesSchema as any,
    sku: {
      // @ts-ignore the typings are wrong
      type: ['string', 'null'],
      minLength: 2,
      maxLength: 63,
    },
    stock: {
      // @ts-ignore the typings are wrong
      type: ['integer', 'null'],
      minimum: 0,
    },
  },
};

export const schema: JSONSchemaType<Product> = {
  type: 'object',
  additionalProperties: false,
  required: [
    ...defaultSchemaEntries.required,
    'soldBy',
    'name',
    'unit',
    'images',
    'groups',
    'category',
    'variants',
  ],
  properties: {
    ...defaultSchemaEntries.properties!,
    soldBy: {
      type: 'string',
      format: 'uuid',
    },
    name: {
      type: 'string',
      minLength: 2,
      maxLength: 255,
    },
    unit: {
      type: 'string',
      enum: Object.values(ProductUnit),
      default: ProductUnit.ITEM,
    },
    images: {
      type: 'array',
      maxItems: 10,
      items: {
        type: 'string',
        minLength: 2,
        maxLength: 1023,
      },
    },
    groups: {
      type: 'array',
      maxItems: 10,
      uniqueItems: true,
      items: {
        type: 'string',
        minLength: 2,
        maxLength: 127,
      },
    },
    category: {
      type: 'string',
      minLength: 2,
      maxLength: 255,
    },
    description: {
      // @ts-ignore the typings are wrong
      type: ['string', 'null'],
      minLength: 2,
      maxLength: 4095,
    },
    variants: {
      type: 'array',
      minItems: 1,
      maxItems: 63,
      items: variantSchema,
      uniqueOn: '/attributes',
      equalSchema: '/attributes',
    },

    // The total stock of all variants
    totalStock: {
      // @ts-ignore the typings are wrong
      type: ['integer', 'null'],
      minimum: 0,
    },
    // If variants have different prices, this is the minimum
    minPrice: {
      // @ts-ignore the typings are wrong
      type: ['number', 'null'],
      exclusiveMinimum: 0,
    },
    // If variants have different prices, this is the maximum, otherwise min and max will be he same.
    maxPrice: {
      // @ts-ignore the typings are wrong
      type: ['number', 'null'],
      exclusiveMinimum: 0,
    },
    // Same as min and max price
    minDiscount: {
      // @ts-ignore the typings are wrong
      type: ['number', 'null'],
      minimum: 0,
    },
    // If variants have different prices, this is the maximum, otherwise min and max will be he same.
    maxDiscount: {
      // @ts-ignore the typings are wrong
      type: ['number', 'null'],
      minimum: 0,
    },
    // Same as min and max price
    minCalculatedPrice: {
      // @ts-ignore the typings are wrong
      type: ['number', 'null'],
      exclusiveMinimum: 0,
    },
    maxCalculatedPrice: {
      // @ts-ignore the typings are wrong
      type: ['number', 'null'],
      exclusiveMinimum: 0,
    },
  },
};

const omittedOrderProductFields = [
  'variants',
  'totalStock',
  'minPrice',
  'maxPrice',
  'minDiscount',
  'maxDiscount',
  'minCalculatedPrice',
  'maxCalculatedPrice',
];

export const orderProductSchema = {
  type: 'object',
  additionalProperties: false,
  required: [...schema.required, ...variantSchema.required].filter(
    x => !omittedOrderProductFields.includes(x)
  ),
  properties: omit(
    { ...schema.properties, ...variantSchema.properties },
    omittedOrderProductFields
  ),
};

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
  title: string;
  subtitle?: string;
  type: 'category' | 'discounted' | 'latest' | 'group';
  value: string;
  isPromoted: boolean;
}

export interface ProductSetResult {
  setTag: ProductSet;
  data?: Product[];
  error?: Error;
  filter?: { query: { [key: string]: any } };
}

const getQueryForSet = (productSet: Pick<ProductSet, 'type' | 'value'>) => {
  switch (productSet.type) {
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

    case 'group': {
      return {
        groups: productSet.value,
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
  if (!variant) {
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

  const variant = product.variants.find(variant =>
    areAttributesEquivalent(variant.attributes, attributes)
  );
  if (!variant) {
    return null;
  }

  return variant;
};

// We don't care about null/undefined properties
export const areAttributesEquivalent = (
  a: Attributes | undefined,
  b: Attributes | undefined
) => {
  return isEqual(omitBy(a, isNil), omitBy(b, isNil));
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
      productSets: ProductSet[],
      params?: Params
    ): Promise<ProductSetResult[]> => {
      return Promise.all(
        productSets.map(setTag => {
          const queryForSet = getQueryForSet(setTag);

          if (!queryForSet) {
            return Promise.resolve({
              setTag,
              error: new Error('Set not found'),
            } as ProductSetResult);
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

    areAttributesEquivalent,

    convertToOrderProduct,

    // If the product has at least one attribute, it means it has variants.
    hasVariants: (product?: Product) => {
      return (
        product &&
        Object.keys(product.variants?.[0]?.attributes ?? {}).length > 0
      );
    },

    validate: (data: Product, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },

    ProductUnit,
    schema,
  };
};
