import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import {
  restrictToOwner,
  associateCurrentUser,
} from 'feathers-authentication-hooks';
import { requireAnyQueryParam, isOwner } from '../../common/hooks/filtering';
import { unless, keep } from 'feathers-hooks-common';
import { sdk } from '@sradevski/la-sdk';
import { validate } from '../../common/hooks/db';

export const hooks = {
  before: {
    all: [],
    find: [requireAnyQueryParam(['forStore'])],
    get: [],
    create: [
      authenticate('jwt'),
      associateCurrentUser({ as: 'forStore' }),
      validate(sdk.delivery.validate),
    ],
    patch: [
      authenticate('jwt'),
      restrictToOwner({ ownerField: 'forStore' }),
      validate(sdk.delivery.validate),
    ],
    remove: [authenticate('jwt'), restrictToOwner({ ownerField: 'forStore' })],
  },

  after: {
    all: [],
    find: [
      unless(
        isOwner('forStore'),
        keep('_id', 'method', 'price', 'freeDeliveryOver', 'forStore'),
      ),
    ],
    get: [
      unless(
        isOwner('forStore'),
        keep('_id', 'method', 'price', 'freeDeliveryOver', 'forStore'),
      ),
    ],
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
