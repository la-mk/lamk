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
    find: [requireAnyQueryParam(['_id', 'soldBy'])],
    get: [],
    create: [authenticate('jwt'), associateCurrentUser({ as: 'soldBy' })],
    patch: [authenticate('jwt'), restrictToOwner({ ownerField: 'soldBy' })],
    remove: [authenticate('jwt'), restrictToOwner({ ownerField: 'soldBy' })],
  },

  after: {
    all: [],
    find: [
      unless(
        isOwner('soldBy'),
        keep(
          '_id',
          'name',
          'price',
          'category',
          'images',
          'description',
          'soldBy',
        ),
      ),
    ],
    get: [
      unless(
        isOwner('soldBy'),
        keep(
          '_id',
          'name',
          'price',
          'category',
          'images',
          'description',
          'soldBy',
        ),
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
