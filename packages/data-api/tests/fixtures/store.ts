import { Store } from '@la-mk/la-sdk/dist/models/store';
import { v4 as uuid } from 'uuid';
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
