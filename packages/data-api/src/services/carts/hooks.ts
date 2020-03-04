import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import { disallow } from 'feathers-hooks-common';
import { sdk } from '@sradevski/la-sdk';
import { validate, unique } from '../../common/hooks/db';
import { setCurrentUser, queryWithCurrentUser } from '../../common/hooks/auth';

export const hooks = {
  before: {
    all: [],
    find: [authenticate('jwt'), queryWithCurrentUser(['forUser'])],
    get: [authenticate('jwt'), queryWithCurrentUser(['forUser'])],
    create: [
      disallow('external'),
      authenticate('jwt'),
      // For a start, we want to have 1:1 mapping between user and cart and use the same ID to simplify usage.
      setCurrentUser(['_id', 'forUser']),
      validate(sdk.cart.validate),
      // Since we set the same ID as the user, double-check that the ID is unique.
      unique(['_id']),
    ],
    // TODO: We can check if the product exists when adding it to the cart, although it is not critical to do so.
    patch: [
      authenticate('jwt'),
      queryWithCurrentUser(['forUser']),
      validate(sdk.cart.validate),
    ],
    // Only allow server to be able to remove a cart
    remove: [disallow('external')],
  },
};
