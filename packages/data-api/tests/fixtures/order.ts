import { Order } from '@la-mk/la-sdk/dist/models/order';
import { defaultGenerator, GeneratorFunc } from './helpers';
import { sdk } from '@la-mk/la-sdk';

const defaultFixture: Partial<Order> = {
  status: sdk.order.OrderStatus.PENDING_SHIPMENT,
  paymentMethod: sdk.storePaymentMethods.PaymentMethodNames.PAY_ON_DELIVERY,
  currency: 'mkd',
  campaigns: [],
};

export default {
  generator: (...args) =>
    defaultGenerator<Order>(
      { modelName: 'orders', defaultFixture, uniqueData: () => ({}) },
      ...args,
    ),
} as { generator: GeneratorFunc<Order> };
