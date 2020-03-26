import * as _ from 'lodash';
import { sdk } from '@sradevski/la-sdk';
import { validate } from '../../common/hooks/db';
import { disallow, checkContext, isProvider } from 'feathers-hooks-common';
import {
  StorePaymentMethods,
  PaymentProcessors,
  PaymentMethod,
} from '@sradevski/la-sdk/dist/models/storePaymentMethods';
import { Order } from '@sradevski/la-sdk/dist/models/order';
import { BadRequest } from '../../common/errors';
import {
  OrderPayments,
  PaymentTransaction,
} from '@sradevski/la-sdk/dist/models/orderPayments';
import { setOrderStatus } from './serviceHooks/orders';
import { HookContextWithState } from '../../common/types';
import * as nestpay from './nestpay';
import { Service } from '@feathersjs/feathers';
import { FindResult } from '@sradevski/la-sdk/dist/setup';

const getProcessingDetails = async (
  orderId: string,
  ordersService: Service<Order>,
  storePaymentMethodsService: Service<StorePaymentMethods>,
) => {
  const order: Order = await ordersService.get(orderId);
  const storePaymentMethods: StorePaymentMethods = ((await storePaymentMethodsService.find(
    {
      query: { forStore: order.orderedFrom },
    },
  )) as FindResult<StorePaymentMethods>)?.data?.[0];

  const creditCardMethod = storePaymentMethods?.methods?.find(
    method =>
      method.name === sdk.storePaymentMethods.PaymentMethodNames.CREDIT_CARD,
  );

  if (!creditCardMethod) {
    throw new BadRequest('The store does not support credit card payments');
  }

  if (!creditCardMethod.clientKey || !creditCardMethod.processor) {
    throw new BadRequest(
      'Credit card payments are misconfigured, contact the store directly',
    );
  }

  return { processorInfo: creditCardMethod, order };
};

const setProcessingDetails = async (
  ctx: HookContextWithState<{ processorInfo: PaymentMethod; order: Order }>,
) => {
  checkContext(ctx, 'before', ['create']);
  const orderId = nestpay.getField('oid', ctx.data);
  const processingDetails = await getProcessingDetails(
    orderId,
    ctx.app.services['orders'],
    ctx.app.services['storePaymentMethods'],
  );

  ctx.contextState = processingDetails;
};

const hashValidators: {
  [key in PaymentProcessors]: (clientKey: string, data: any) => boolean;
} = {
  [sdk.storePaymentMethods.PaymentProcessors.HALKBANK]: nestpay.hashValidator,
};

const getHalkbankStatus = (data: any) => {
  const resp = nestpay.getField('Response', data);
  switch (resp) {
    case 'Approved':
      return sdk.orderPayments.TransactionStatus.APPROVED;
    case 'Declined':
      return sdk.orderPayments.TransactionStatus.DECLINED;
    default:
      return sdk.orderPayments.TransactionStatus.ERROR;
  }
};

const normalizers: {
  [key in PaymentProcessors]: (data: any) => OrderPayments;
} = {
  [sdk.storePaymentMethods.PaymentProcessors.HALKBANK]: data => {
    const transaction: PaymentTransaction = {
      status: getHalkbankStatus(data),
      amount: parseFloat(nestpay.getField('amount', data)),
      message: nestpay.getField('ErrMsg', data) || null,
      processorId: nestpay.getField('xid', data),
      userIp: nestpay.getField('clientIp', data),
      date: new Date(Date.now()).toISOString(),
    };

    return {
      _id: data._id,
      forOrder: nestpay.getField('oid', data),
      isSuccessful:
        transaction.status === sdk.orderPayments.TransactionStatus.APPROVED,
      transactions: [transaction],
      createdAt: data.createdAt,
      modifiedAt: data.modifiedAt,
    };
  },
};

const validatePaymentHash = async (
  ctx: HookContextWithState<{ processorInfo: PaymentMethod; order: Order }>,
) => {
  checkContext(ctx, 'before', ['create']);
  const { processorInfo } = ctx.contextState;
  if (!hashValidators[processorInfo.processor as PaymentProcessors]) {
    throw new BadRequest('Bank is not supported');
  }

  const validator =
    hashValidators[processorInfo.processor as PaymentProcessors];

  if (!validator(processorInfo.clientKey as string, ctx.data)) {
    throw new BadRequest('The request did not come from the processing bank!');
  }
};

const normalizePaymentProcessorData = async (
  ctx: HookContextWithState<{ processorInfo: PaymentMethod; order: Order }>,
) => {
  checkContext(ctx, 'before', ['create']);
  const { processorInfo } = ctx.contextState;

  if (!normalizers[processorInfo.processor as PaymentProcessors]) {
    throw new BadRequest('Bank is not supported');
  }

  const normalizer = normalizers[processorInfo.processor as PaymentProcessors];
  ctx.data = normalizer(ctx.data);
};

const setResultIfExists = async (
  ctx: HookContextWithState<{ processorInfo: PaymentMethod; order: Order }>,
) => {
  checkContext(ctx, 'before', ['create']);
  const { forOrder, transactions } = ctx.data;
  const existingOrderPayments = (
    await ctx.app.services['orderPayments'].find({
      query: { forOrder },
    })
  )?.data?.[0];

  // If it doesn't exist, continue with creating it.
  if (!existingOrderPayments) {
    return;
  }

  existingOrderPayments.transactions = [
    ...existingOrderPayments.transactions,
    ...transactions,
  ];

  // By setting result, we skip the `create` DB call.
  ctx.result = await ctx.app.services['orderPayments'].patch(
    existingOrderPayments._id,
    existingOrderPayments,
  );
};

const validateOrderPrice = async (
  ctx: HookContextWithState<{ processorInfo: PaymentMethod; order: Order }>,
) => {
  checkContext(ctx, 'before', 'create');
  if (
    Math.round(ctx.contextState.order.calculatedTotal) !==
    (_.last(ctx.data.transactions) as PaymentTransaction).amount
  ) {
    throw new BadRequest(
      "The paid amount doesn't match the order price, please contact us",
    );
  }
};

const sanitizeResponse = async (
  ctx: HookContextWithState<{ processorInfo: PaymentMethod; order: Order }>,
) => {
  checkContext(ctx, 'after');
  // We don't want to sanitize it for server requests.
  if (isProvider('server')(ctx)) {
    return;
  }

  ctx.result = {
    forOrder: ctx.result.forOrder,
    isSuccessful: ctx.result.isSuccessful,
    transactions: [
      _.pick(_.last(ctx.result.transactions), ['status', 'message']),
    ],
  };
};

export const hooks = {
  before: {
    all: [],
    find: [disallow('external')],
    get: [disallow('external')],
    create: [
      // This will be used in the subsequent methods
      setProcessingDetails,
      // This checks if the request is indeed from the processor and it uses the clientKey from the storePaymentMethods service.
      validatePaymentHash,
      normalizePaymentProcessorData,
      validateOrderPrice,
      setResultIfExists,
      validate(sdk.orderPayments.validate),
    ],
    patch: [
      // Patch will only be called from inside `create` as external callers cannot know if the payment entry already exists or not
      disallow('external'),
      validate(sdk.orderPayments.validate),
    ],
    // TODO: Remove when an order is removed.
    remove: [disallow('external')],
  },

  after: {
    all: [sanitizeResponse],
    find: [],
    get: [],
    create: [setOrderStatus],
    patch: [],
    remove: [],
  },
};
