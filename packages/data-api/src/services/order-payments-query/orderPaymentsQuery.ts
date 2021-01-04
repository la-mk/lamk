import { Application, Service } from '@feathersjs/feathers';
import { hooks } from './hooks';
import { GeneralError, BadRequest } from '../../common/errors';
import { sdk } from '@la-mk/la-sdk';
import {
  PaymentMethod,
  StorePaymentMethods,
} from '@la-mk/la-sdk/dist/models/storePaymentMethods';
import got from 'got';
import * as nestpay from '../../common/paymentProcessors/nestpay';
import { Order } from '@la-mk/la-sdk/dist/models/order';
import { logger } from '../../common/logger';

const getOrderTransactionHistory = async (
  orderId: string,
  creditCardInfo?: PaymentMethod,
) => {
  if (!orderId || !creditCardInfo) {
    throw new BadRequest('Order ID or credit card processor info are missing');
  }

  switch (creditCardInfo.processor) {
    case sdk.storePaymentMethods.PaymentProcessors.HALKBANK: {
      const resp = await got.post(nestpay.PROCESSOR_URL, {
        body: nestpay.getStatusQueryRequest(orderId, creditCardInfo),
      });

      return nestpay.parseStatusQueryResponse(resp.body);
    }
  }
};

// @ts-ignore
class OrderPaymentsQueryService implements Service<any> {
  app: Application;
  constructor(options: { app: Application }) {
    if (!options?.app) {
      throw new Error(
        'Order payments query service: `options.app` must be provided',
      );
    }

    this.app = options.app;
  }

  // The ID is the order id.
  // @ts-ignore
  async get(id: string) {
    try {
      const order: Order = await this.app.services['orders'].get(id);
      const storePaymentMethods: StorePaymentMethods = (
        await this.app.services['storePaymentMethods'].find({
          query: {
            forStore: order.orderedFrom,
          },
        })
      ).data[0];

      const creditCardInfo = storePaymentMethods.methods.find(
        method =>
          method.name ===
          sdk.storePaymentMethods.PaymentMethodNames.CREDIT_CARD,
      );

      return await getOrderTransactionHistory(id, creditCardInfo);
    } catch (err) {
      logger.error(
        `Failed to query payments service for order: ${id}`,
        err.message,
      );

      throw new GeneralError('Failed to query payments service');
    }
  }
}

export const orderPaymentsQuery = (app: Application) => {
  app.use('/orderPaymentsQuery', new OrderPaymentsQueryService({ app }));
  const service = app.service('orderPaymentsQuery');
  service.hooks(hooks);
};
