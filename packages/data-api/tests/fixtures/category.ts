import { Category } from '@la-mk/la-sdk/dist/models/category';
import { defaultGenerator, GeneratorFunc } from './helpers';

const defaultFixture: Partial<Category> = {
  level1: 'some-category',
  level2: 'some-category',
  level3: 'some-category',
};

export default {
  generator: (...args) =>
    defaultGenerator<Category>(
      {
        modelName: 'categories',
        defaultFixture,
        uniqueData: () => ({}),
      },
      ...args,
    ),
} as { generator: GeneratorFunc<Category> };
