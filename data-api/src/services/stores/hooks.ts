import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import {
  queryWithCurrentUser,
  restrictToOwner,
  associateCurrentUser,
} from 'feathers-authentication-hooks';
import { unique } from '../../common/hooks/unique';
import { setIdFromUser } from '../../common/hooks/db';

export const hooks = {
  before: {
    all: [],
    find: [authenticate('jwt'), queryWithCurrentUser({ as: 'ownedBy' })],
    get: [authenticate('jwt'), queryWithCurrentUser({ as: 'ownedBy' })],
    create: [
      authenticate('jwt'),
      associateCurrentUser({ as: 'ownedBy' }),
      // For a start, we want to have 1:1 mapping between user and store and use the same ID to simplify usage.
      setIdFromUser,
      // Since we set the same ID as the user, double-check that the ID is unique.
      unique(['_id']),
    ],
    update: [authenticate('jwt'), restrictToOwner({ ownerField: 'ownedBy' })],
    patch: [authenticate('jwt'), restrictToOwner({ ownerField: 'ownedBy' })],
    remove: [authenticate('jwt'), restrictToOwner({ ownerField: 'ownedBy' })],
  },

  after: {
    all: [],
    find: [],
    get: [],
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
