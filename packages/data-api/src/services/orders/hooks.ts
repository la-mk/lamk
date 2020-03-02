import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import {
  restrictToOwner,
  associateCurrentUser,
} from 'feathers-authentication-hooks';
import { setFields } from '../../common/hooks/db';
import { HookContext } from '@feathersjs/feathers';
import { BadRequest } from '../../common/errors';
import { sdk } from '@sradevski/la-sdk';
import { validate } from '../../common/hooks/db';
import { discard } from 'feathers-hooks-common';
import { queryOneOfWithCurrentUser } from '../../common/hooks/filtering';

// We need to check that the order only contains products from the specified store,
// and also check that the passed product matches what we have in the DB to ensure the user didn't tamper with the prices for example.
const validateOrderedItems = async (ctx: HookContext) => {
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

export const hooks = {
  before: {
    all: [],
    find: [
      authenticate('jwt'),
      queryOneOfWithCurrentUser(['orderedFrom', 'orderedBy']),
    ],
    get: [
      authenticate('jwt'),
      queryOneOfWithCurrentUser(['orderedFrom', 'orderedBy']),
    ],
    create: [
      authenticate('jwt'),
      associateCurrentUser({ as: 'orderedBy' }),
      setFields({ status: 'pending' }),
      validate(sdk.order.validate),
      // TODO: This validation should be part of the model.
      validateOrderedItems,
    ],
    patch: [
      authenticate('jwt'),
      restrictToOwner({ ownerField: 'orderedFrom' }),
      discard('_id'),
      validate(sdk.order.validate),
    ],
    remove: [
      authenticate('jwt'),
      restrictToOwner({ ownerField: 'orderedFrom' }),
    ],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    patch: [],
    remove: [],
  },
};
