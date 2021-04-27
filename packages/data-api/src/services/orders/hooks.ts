import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import { sdk } from '@la-mk/la-sdk';
import { HookContext } from '@feathersjs/feathers';
import { BadRequest } from '../../common/errors';
import { validate } from '../../common/hooks/db';
import { queryWithCurrentUser, setCurrentUser } from '../../common/hooks/auth';
import { checkContext, disallow } from 'feathers-hooks-common';
import { Campaign } from '@la-mk/la-sdk/dist/models/campaign';
import { settableFields } from '../../common/hooks/filtering';
import { Product } from '@la-mk/la-sdk/dist/models/product';
import { FindResult } from '@la-mk/la-sdk/dist/setup';
import { Order } from '@la-mk/la-sdk/dist/models/order';
import { logger } from '../../common/logger';
import { t } from '../../common/i18n';
import { getEmailTemplate } from '../email/templateProcessor';
import { User } from '@la-mk/la-sdk/dist/models/user';

const HORIZONTAL_LOGO_LAMK = 'https://la.mk/logo-horizontal.svg';

// TODO: We don't have to wait when sending an email, but this will do for now.
export const sendOrderNotification = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['patch', 'create']);
  const order: Order = Array.isArray(ctx.result) ? ctx.result[0] : ctx.result;

  // TODO: We want to send different emails for different statuses, but an order confirmation mail (after payment) should be enough for now.
  if (order.status !== sdk.order.OrderStatus.PENDING_SHIPMENT) {
    return;
  }

  const orderedByUser: User = await ctx.app.services['users'].get(
    order.orderedBy,
  );
  const store = await ctx.app.services['stores'].get(order.orderedFrom);

  if (!store) {
    logger.warn(
      'Could not find store when sending order notification, skipping',
    );
    return;
  }

  if (!orderedByUser) {
    logger.warn(
      'Could not find ordered by user when sending order notification, skipping',
    );
    return;
  }

  const storeDomain = store
    ? store.customDomain || `${store.slug}.la.mk`
    : undefined;
  const storeUrl = `https://${storeDomain ?? 'la.mk'}`;
  const prices = sdk.utils.pricing.calculatePrices(
    order.ordered,
    order.delivery,
    order.campaigns,
  );

  const templateData = {
    storeName: store?.name ?? storeDomain,
    storeUrl,
    storeLogoUrl: store.logo?._id
      ? sdk.artifact.getUrlForImage(store.logo._id, store._id, {
          h: 64,
          dpr: 2,
        })
      : HORIZONTAL_LOGO_LAMK,
    seeOrderLink: `${storeUrl}/orders`,
    deliveryMethod: order.delivery.method,
    paymentMethod: order.paymentMethod,
    subtotal: prices.productsTotal,
    campaignDiscount: (
      prices.withCampaignsTotal - prices.productsTotal
    ).toFixed(1),
    shippingCost: prices.deliveryTotal,
    total: prices.total,
    deliverTo: order.deliverTo,
    currency: t(`currency.${store?.preferences.currency || 'mkd'}`),
  };

  try {
    await ctx.app.services['email'].create({
      from: { email: 'noreply@la.mk', name: templateData.storeName },
      to: orderedByUser.email,
      subject: `${templateData.storeName} - ${t('cart.orderSuccess')}`,
      html: await getEmailTemplate('order-success', templateData),
      text: `
        Your order was successful!

        Your order on ${storeUrl} was successful, and will be shipped as soon as possible.

        Order total: ${prices.total}

        Thank you for shopping.
      `,
    });
  } catch (err) {
    logger.error(err.message);
  }
};

// FUTURE: Improve how we do the validation, maybe reassign all fields in the hook instead of checking the validity of each of them.

// We need to check that the order only contains products from the specified store,
// and also check that the passed product matches what we have in the DB to ensure the user didn't tamper with the prices for example.
const validateOrderItems = async (ctx: HookContext) => {
  checkContext(ctx, 'before', ['create']);
  const { orderedFrom, ordered } = ctx.data as {
    ordered: Order['ordered'];
    orderedFrom: string;
  };

  ordered.forEach(orderItem => {
    if (orderItem.product.soldBy !== orderedFrom) {
      throw new BadRequest('Product is not from the specified store');
    }
  });

  const products = ((await ctx.app.services['products'].find({
    query: {
      _id: {
        $in: ordered.map(orderItem => orderItem.product._id),
      },
    },
  })) as FindResult<Product>).data;

  ordered.forEach(orderItem => {
    const dbProduct = products.find(
      (product: any) => product._id === orderItem.product._id,
    );

    if (!dbProduct) {
      throw new BadRequest('A product in the cart no longer exists');
    }

    const variant = sdk.product.getVariantForAttributes(
      dbProduct,
      orderItem.product.attributes,
    );

    if (!variant) {
      throw new BadRequest(
        'The variant of the product in your cart does not exist anymore, remove the product and try adding it again',
      );
    }

    if (
      variant.price !== orderItem.product.price ||
      variant.calculatedPrice !== orderItem.product.calculatedPrice
    ) {
      throw new BadRequest(
        'The price of a product in your cart changed, refresh the page and try again',
      );
    }

    // If the stock is not set, it means there is unlimited stock.
    if (variant.stock == null) {
      return;
    }

    if (variant.stock === 0) {
      throw new BadRequest(
        `It seems ${dbProduct.name} is out of stock, try again later`,
      );
    }

    if ((variant.stock ?? 0) < orderItem.quantity) {
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

    // TODO: Add a state machine for how the order status can change.
    patch: [
      authenticate('jwt'),
      settableFields(['status', 'deliveryTracking', 'modifiedAt']),
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
  after: {
    all: [],
    create: [sendOrderNotification],
    patch: [sendOrderNotification],
  },
};
