import { Product } from '@la-mk/la-sdk/dist/models/product';
import { sdk } from '@la-mk/la-sdk';
import { defaultGenerator, GeneratorFunc } from './helpers';

const defaultFixture: Partial<Product> = {
  name: 'Test product',
  unit: sdk.product.ProductUnit.ITEM,
  variants: [{ price: 1234 }],

  category: 'some-category',
  media: [],
  groups: [],
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
