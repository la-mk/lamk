import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import {
  queryWithCurrentUser,
  restrictToOwner,
  associateCurrentUser,
} from 'feathers-authentication-hooks';
import { unique } from '../../common/hooks/unique';
import { disallow, discard } from 'feathers-hooks-common';
import { sdk } from '@sradevski/la-sdk';
import { validate, setFieldsFromOther } from '../../common/hooks/db';

export const hooks = {
  before: {
    all: [],
    find: [authenticate('jwt'), queryWithCurrentUser({ as: 'forUser' })],
    get: [authenticate('jwt'), restrictToOwner({ ownerField: 'forUser' })],
    create: [
      disallow('socketio', 'primus', 'rest', 'external'),
      authenticate('jwt'),
      associateCurrentUser({ as: 'forUser' }),
      // For a start, we want to have 1:1 mapping between user and cart and use the same ID to simplify usage.
      setFieldsFromOther([['_id', 'forUser']]),
      // Since we set the same ID as the user, double-check that the ID is unique.
      unique(['_id']),
      validate(sdk.cart.validate),
    ],
    patch: [
      authenticate('jwt'),
      restrictToOwner({ ownerField: 'forUser' }),
      discard('_id'),
      discard('forUser'),
      validate(sdk.cart.validate),
    ],
    // Only allow server to be able to remove a cart
    remove: [disallow('external')],
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
