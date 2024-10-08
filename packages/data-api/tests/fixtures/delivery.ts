import { Delivery } from '@la-mk/la-sdk/dist/models/delivery';
import { sdk } from '@la-mk/la-sdk';
import { defaultGenerator, GeneratorFunc } from './helpers';

const defaultFixture: Partial<Delivery> = {
  method: sdk.delivery.DeliveryMethods.CARGO_PICKUP,
  price: 120,
  freeDeliveryOver: 2000,
};

export default {
  generator: (...args) =>
    defaultGenerator<Delivery>(
      {
        modelName: 'deliveries',
        defaultFixture,
        uniqueData: () => ({}),
      },
      ...args,
    ),
} as { generator: GeneratorFunc<Delivery> };
