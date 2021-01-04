import { Address } from '@la-mk/la-sdk/dist/models/address/address';
import { defaultGenerator, GeneratorFunc } from './helpers';

const defaultFixture: Partial<Address> = {
  name: 'Test address',
  country: 'MK',
  region: 'Bitola',
  city: 'Bitola',
  zip: '7000',
  street: 'Unknown',
  person: 'Addresses',
  phoneNumber: '1234567',
};

export default {
  generator: (...args) =>
    defaultGenerator<Address>(
      { modelName: 'addresses', defaultFixture, uniqueData: () => ({}) },
      ...args,
    ),
} as { generator: GeneratorFunc<Address> };
