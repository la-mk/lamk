import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import {
  restrictToOwner,
  associateCurrentUser,
} from 'feathers-authentication-hooks';
import { requireAnyQueryParam, isOwner } from '../../common/hooks/filtering';
import { unless, keep } from 'feathers-hooks-common';

export const hooks = {
  before: {
    all: [],
    find: [requireAnyQueryParam(['forStore'])],
    get: [],
    create: [authenticate('jwt'), associateCurrentUser({ as: 'forStore' })],
    patch: [authenticate('jwt'), restrictToOwner({ ownerField: 'forStore' })],
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
