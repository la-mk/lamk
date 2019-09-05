import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import {
  queryWithCurrentUser,
  restrictToOwner,
  associateCurrentUser,
} from 'feathers-authentication-hooks';
import { setObjectIdFromUser } from '../../common/hooks/mongo';
import { unique } from '../../common/hooks/unique';

export const hooks = {
  before: {
    all: [],
    find: [authenticate('jwt'), queryWithCurrentUser({ as: 'ownedBy' })],
    get: [authenticate('jwt'), queryWithCurrentUser({ as: 'ownedBy' })],
    create: [
      authenticate('jwt'),
      associateCurrentUser({ as: 'ownedBy' }),
      // For a start, we want to have 1:1 mapping between user and store and use the same ID to simplify usage.
      setObjectIdFromUser,
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
