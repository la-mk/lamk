import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import {
  restrictToOwner,
  associateCurrentUser,
} from 'feathers-authentication-hooks';
import { unique } from '../../common/hooks/unique';
import { requireAnyQueryParam, isOwner } from '../../common/hooks/filtering';
import { unless, keep } from 'feathers-hooks-common';

export const hooks = {
  before: {
    all: [],
    find: [requireAnyQueryParam(['ownedBy'])],
    get: [],
    create: [
      authenticate('jwt'),
      associateCurrentUser({ as: 'ownedBy' }),
      // For a start, we want to have 1:1 mapping between user and store and use the same ID to simplify usage.
      associateCurrentUser({ as: '_id' }),
      // Since we set the same ID as the user, double-check that the ID is unique.
      unique(['_id']),
    ],
    update: [authenticate('jwt'), restrictToOwner({ ownerField: 'ownedBy' })],
    patch: [authenticate('jwt'), restrictToOwner({ ownerField: 'ownedBy' })],
    remove: [authenticate('jwt'), restrictToOwner({ ownerField: 'ownedBy' })],
  },

  after: {
    all: [],
    find: [
      unless(
        isOwner('ownedBy'),
        keep('_id', 'name', 'slug', 'logo', 'isPublished', 'ownedBy'),
      ),
    ],
    get: [
      unless(
        isOwner('ownedBy'),
        keep('_id', 'name', 'slug', 'logo', 'isPublished', 'ownedBy'),
      ),
    ],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
