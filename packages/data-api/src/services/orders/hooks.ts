import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import { sdk } from '@sradevski/la-sdk';
import { setFields } from '../../common/hooks/db';
import { HookContext } from '@feathersjs/feathers';
import { BadRequest } from '../../common/errors';
import { validate } from '../../common/hooks/db';
import { queryWithCurrentUser, setCurrentUser } from '../../common/hooks/auth';
import { checkContext } from 'feathers-hooks-common';

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
  const { campaigns, ordered, orderedFrom, delivery } = ctx.data;

  if (!campaigns || campaigns.length) {
    return;
  }

  const dbCampaignsResult = ctx.app.services['campaigns'].find({
    query: {
      forStore: orderedFrom,
      isActive: true,
    },
  });

  if (
    dbCampaignsResult.total <= 0 ||
    dbCampaignsResult.total !== campaigns.length
  ) {
    throw new BadRequest(
      'The campaigns applied to the products no longer exist or have changed, refresh the page and try again',
    );
  }

  const dbCampaigns = dbCampaignsResult.data;
  const orderTotal = sdk.utils.pricing.calculatePrices(
    ordered,
    delivery,
    campaigns,
  ).total;
  const dbTotal = sdk.utils.pricing.calculatePrices(
    ordered,
    delivery,
    dbCampaigns,
  ).total;

  if (orderTotal !== dbTotal) {
    throw new BadRequest(
      'The campaigns applied to the products no longer exist or have changed, refresh the page and try again',
    );
  }

  if (orderTotal < 0) {
    throw new BadRequest('The order cannot be below 0');
  }
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
      setFields({ status: sdk.order.OrderStatus.PENDING }),
      validate(sdk.order.validate),
      // TODO: This validation should be part of the model.
      validateOrderDelivery,
      validateOrderCampaigns,
      validateOrderItems,
    ],
    patch: [
      authenticate('jwt'),
      // Only the store can modify an order as things stand now.
      queryWithCurrentUser(['orderedFrom']),
      validate(sdk.order.validate),
    ],
    remove: [authenticate('jwt'), queryWithCurrentUser(['orderedFrom'])],
  },
};
