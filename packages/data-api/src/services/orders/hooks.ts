import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import {
  restrictToOwner,
  associateCurrentUser,
} from 'feathers-authentication-hooks';
import { setFields } from '../../common/hooks/db';
import { HookContext } from '@feathersjs/feathers';
import { BadRequest } from '../../common/errors';
import { sdk } from '@lamk/la-sdk';
import { validate } from '../../common/hooks/db';

// We need to check that the order only contains products from the specified store,
// and also check that the passed product matches what we have in the DB to ensure the user didn't tamper with the prices for example.
const validateOrderedItems = async (ctx: HookContext) => {
  const { orderedFrom, ordered } = ctx.data;
  const orderedProducts = ordered.map((orderItem: any) => orderItem.product);

  orderedProducts.forEach((orderedProduct: any) => {
    if (orderedProduct.soldBy !== orderedFrom) {
      throw new BadRequest('Product is not from the specified store');
    }
  });

  const products = (
    await ctx.app.services['products'].find({
      query: {
        _id: {
          $in: orderedProducts.map((orderedProduct: any) => orderedProduct._id),
        },
      },
    })
  ).data;

  orderedProducts.forEach((orderedProduct: any) => {
    const dbProduct = products.find(
      (product: any) => product._id === orderedProduct._id,
    );

    if (!dbProduct) {
      throw new BadRequest('A product in the cart no longer exists');
    }

    if (dbProduct.price !== orderedProduct.price) {
      throw new BadRequest(
        'The price of a product in your cart changed, refresh the page and try again',
      );
    }
  });
};

export const hooks = {
  before: {
    all: [],
    // find: [authenticate('jwt'), queryWithCurrentUser({ as: 'orderedFrom' })],
    // get: [authenticate('jwt'), queryWithCurrentUser({ as: 'orderedFrom' })],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
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
