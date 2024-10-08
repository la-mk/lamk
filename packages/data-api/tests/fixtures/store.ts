import { Store } from '@la-mk/la-sdk/dist/models/store';
import { v4 as uuid } from 'uuid';
import { defaultGenerator, GeneratorFunc } from './helpers';

const defaultFixture: Partial<Store> = {
  name: 'Test campaigns',
  slug: 'campaigns-test',
  logo: {
    _id: '2345',
    height: 100,
    width: 100,
    mimeType: 'image/png',
    size: 1234,
  },
  preferences: {},
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
