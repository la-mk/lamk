import { Product } from '@sradevski/la-sdk/dist/models/product';
import { sdk } from '@sradevski/la-sdk';
import { defaultGenerator, GeneratorFunc } from './helpers';

const defaultFixture: Partial<Product> = {
  name: 'Test product',
  unit: sdk.product.ProductUnit.ITEM,
  price: 1234,
  category: 'some-category',
  images: [] as string[],
  groups: [] as string[],
};

export default {
  generator: (...args) =>
    defaultGenerator<Product>(
      {
        modelName: 'products',
        defaultFixture,
        uniqueData: () => ({}),
      },
      ...args,
    ),
} as { generator: GeneratorFunc<Product> };
