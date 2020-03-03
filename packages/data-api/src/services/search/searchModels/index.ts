import { Product } from '@sradevski/la-sdk/dist/models/product';
import { transliterate } from '@sradevski/nlp';

//TODO: Un-hardcode transliteration language and either detect it or store it in DB.

const normalizeText = (text: string | undefined) => {
  if (!text) {
    return '';
  }

  return transliterate(text, 'mk', 'en')
    .toLocaleLowerCase('mk-MK')
    .replace('\n', ' ');
};

// These are all supported models to search from and the schemas are created on initialization
export const productsModel = {
  schema: {
    name: 'products',
    fields: [
      {
        name: 'name',
        type: 'string',
        facet: false,
      },
      {
        name: 'soldBy',
        type: 'string',
        facet: false,
      },
      {
        name: 'calculatedPrice',
        type: 'float',
        facet: false,
      },
      {
        name: 'sku',
        type: 'string',
        facet: false,
      },
      {
        name: 'category',
        type: 'string',
        facet: true,
      },
      {
        name: 'description',
        type: 'string',
        facet: false,
      },
      // The data model stores an ISO string date, but the current search engine only supports a number for sorting, so we need to store the timestamp here.
      {
        name: 'createdAt',
        type: 'int32',
        facet: false,
      },
    ],
    // eslint-disable-next-line
    default_sorting_field: 'createdAt',
  },

  searchFields: ['name', 'description', 'sku'],

  storeIdField: 'soldBy',

  transformSearchQuery: (search: string) => normalizeText(search),

  transform: (product: Product) => {
    return {
      id: product._id,
      soldBy: product.soldBy,
      name: normalizeText(product.name),
      description: normalizeText(product.description) ?? '',
      sku: product.sku ?? '',
      calculatedPrice: product.calculatedPrice,
      category: product.category,
      // Convert to seconds so it fits in int32 (required for default sort)
      createdAt: Math.round(new Date(product.createdAt).getTime() / 1000),
    };
  },
};
