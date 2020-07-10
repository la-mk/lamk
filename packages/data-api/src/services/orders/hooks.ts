import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import { sdk } from '@sradevski/la-sdk';
import { HookContext } from '@feathersjs/feathers';
import { BadRequest } from '../../common/errors';
import { validate } from '../../common/hooks/db';
import { queryWithCurrentUser, setCurrentUser } from '../../common/hooks/auth';
import { checkContext, disallow } from 'feathers-hooks-common';
import { Campaign } from '@sradevski/la-sdk/dist/models/campaign';
import { patchableFields } from '../../common/hooks/filtering';

// FUTURE: Improve how we do the validation, maybe reassign all fields in the hook instead of checking the validity of each of them.

// We need to check that the order only contains products from the specified store,
// and also check that the passed product matches what we have in the DB to ensure the user didn't tamper with the prices for example.
const validateOrderItems = async (ctx: HookContext) => {
  checkContext(ctx, 'before', ['create']);
  const { orderedFrom, ordered } = ctx.data;

  ordered.forEach((orderItem: any) => {
    if (orderItem.product.soldBy !== orderedFrom) {
      throw new BadRequest('Product is not from the specified store');
    }
  });

  const products = (
    await ctx.app.services['products'].find({
      query: {
        _id: {
          $in: ordered.map((orderItem: any) => orderItem.product._id),
        },
      },
    })
  ).data;

  ordered.forEach((orderItem: any) => {
    const dbProduct = products.find(
      (product: any) => product._id === orderItem.product._id,
    );

    if (!dbProduct) {
      throw new BadRequest('A product in the cart no longer exists');
    }

    if (
      dbProduct.price !== orderItem.product.price ||
      dbProduct.calculatedPrice !== orderItem.product.calculatedPrice
    ) {
      throw new BadRequest(
        'The price of a product in your cart changed, refresh the page and try again',
      );
    }

    // If the stock is not set, it means there is unlimited stock.
    if (dbProduct.stock === null) {
      return;
    }

    if (dbProduct.stock === 0) {
      throw new BadRequest(
        `It seems ${dbProduct.name} is out of stock, try again later`,
      );
    }

    if (dbProduct.stock < orderItem.quantity) {
      throw new BadRequest(
        `There aren't enough items in stock for ${dbProduct.name}, try again later`,
      );
    }
  });
};

const validateOrderDelivery = async (ctx: HookContext) => {
  checkContext(ctx, 'before', ['create']);
  const { delivery, orderedFrom } = ctx.data;
  const dbDeliveryResults = await ctx.app.services['deliveries'].find({
    query: { forStore: orderedFrom },
  });

  if (dbDeliveryResults.total <= 0) {
    throw new BadRequest(
      'The store has not specified delivery conditions, try contacting the store',
    );
  }

  const dbDelivery = dbDeliveryResults.data[0];

  if (
    dbDelivery.price !== delivery.price ||
    dbDelivery.freeDeliveryOver !== delivery.freeDeliveryOver
  ) {
    throw new BadRequest(
      'The delivery price has changed, refresh the page and try again',
    );
  }
};

const validateOrderCampaigns = async (ctx: HookContext) => {
  checkContext(ctx, 'before', ['create']);
  const {
    campaigns,
    ordered,
    orderedFrom,
    delivery,
    calculatedTotal,
  } = ctx.data;

  if (!campaigns || !campaigns.length) {
    return;
  }

  const dbCampaignsResult = await ctx.app.services['campaigns'].find({
    query: {
      forStore: orderedFrom,
      isActive: true,
      _id: { $in: campaigns.map((campaign: Campaign) => campaign._id) },
    },
  });

  if (dbCampaignsResult.total !== campaigns.length) {
    throw new BadRequest(
      'The campaigns applied to the products no longer exist or have changed, refresh the page and try again',
    );
  }

  const dbCampaigns = dbCampaignsResult.data;
  const dbTotal = sdk.utils.pricing.calculatePrices(
    ordered,
    delivery,
    dbCampaigns,
  ).total;

  if (calculatedTotal !== dbTotal) {
    throw new BadRequest(
      'The campaigns applied to the products no longer exist or have changed, refresh the page and try again',
    );
  }
};

// We don't allow any patches to price-related fields for an order, so we are sure that the calculatedTotal won't change on patch.
const calculateTotal = async (ctx: HookContext) => {
  checkContext(ctx, 'before', ['create']);
  const { ordered, delivery, campaigns } = ctx.data;
  // If we are creating the object, we are sure the price field is present.
  ctx.data.calculatedTotal = sdk.utils.pricing.calculatePrices(
    ordered,
    delivery,
    campaigns,
  ).total;

  if (ctx.data.calculatedTotal <= 0) {
    throw new BadRequest('Order has to have a positive total');
  }
};

const setOrderStatus = async (ctx: HookContext) => {
  checkContext(ctx, 'before', ['create']);
  const { paymentMethod } = ctx.data;
  // If we are creating the object, we are sure the price field is present.
  ctx.data.status =
    paymentMethod === sdk.storePaymentMethods.PaymentMethodNames.CREDIT_CARD
      ? sdk.order.OrderStatus.PENDING_PAYMENT
      : sdk.order.OrderStatus.PENDING_SHIPMENT;
};

export const hooks = {
  before: {
    all: [],
    find: [
      authenticate('jwt'),
      queryWithCurrentUser(['orderedFrom', 'orderedBy']),
    ],
    get: [
      authenticate('jwt'),
      queryWithCurrentUser(['orderedFrom', 'orderedBy']),
    ],
    create: [
      authenticate('jwt'),
      setCurrentUser(['orderedBy']),
      setOrderStatus,
      calculateTotal,
      validate(sdk.order.validate),
      // TODO: This validation should be part of the model.
      validateOrderDelivery,
      validateOrderCampaigns,
      validateOrderItems,
    ],

    patch: [
      authenticate('jwt'),
      patchableFields(['status', 'modifiedAt']),
      // Only the store can modify an order as things stand now.
      queryWithCurrentUser(['orderedFrom']),
      validate(sdk.order.validate),
    ],
    remove: [
      disallow('external'),
      authenticate('jwt'),
      queryWithCurrentUser(['orderedFrom']),
    ],
  },
};
