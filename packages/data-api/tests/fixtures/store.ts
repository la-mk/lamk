import { Store } from '@sradevski/la-sdk/dist/models/store';
import uuid from 'uuid/v4';
import { defaultGenerator, GeneratorFunc } from './helpers';

const defaultFixture: Partial<Store> = {
  name: 'Test campaigns',
  slug: 'campaigns-test',
  logo: '2345',
  company: {
    companyName: 'Test',
    companyAddress: 'Test',
    registryNumber: 'Test',
    taxNumber: 'Test',
  },
  contact: {
    email: 'campaigns@test.com',
    phoneNumber: '23456',
  },
  color: '#000000',
  isPublished: true,
};

export default {
  generator: (...args) =>
    defaultGenerator<Store>(
      {
        modelName: 'stores',
        defaultFixture,
        uniqueData: () => ({ slug: uuid() }),
      },
      ...args,
    ),
} as { generator: GeneratorFunc<Store> };
