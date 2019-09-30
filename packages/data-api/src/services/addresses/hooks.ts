import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import {
  restrictToOwner,
  associateCurrentUser,
  queryWithCurrentUser,
} from 'feathers-authentication-hooks';

export const hooks = {
  before: {
    all: [],
    find: [authenticate('jwt'), queryWithCurrentUser({ as: 'addressFor' })],
    get: [authenticate('jwt'), queryWithCurrentUser({ as: 'addressFor' })],
    create: [authenticate('jwt'), associateCurrentUser({ as: 'addressFor' })],
    patch: [authenticate('jwt'), restrictToOwner({ ownerField: 'addressFor' })],
    remove: [authenticate('jwt'), restrictToOwner({ ownerField: 'addressFor' })],
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
    update: [],
    patch: [],
    remove: [],
  },
};
