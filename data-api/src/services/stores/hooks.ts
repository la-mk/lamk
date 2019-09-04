import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import {
  queryWithCurrentUser,
  restrictToOwner,
  associateCurrentUser,
} from 'feathers-authentication-hooks';

export const hooks = {
  before: {
    all: [],
    find: [authenticate('jwt'), queryWithCurrentUser({ as: 'ownedBy' })],
    get: [authenticate('jwt'), queryWithCurrentUser({ as: 'ownedBy' })],
    create: [authenticate('jwt'), associateCurrentUser({ as: 'ownedBy' })],
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
