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
    find: [authenticate('jwt'), queryWithCurrentUser({ as: 'orderedFrom' })],
    get: [authenticate('jwt'), queryWithCurrentUser({ as: 'orderedFrom' })],
    create: [authenticate('jwt'), associateCurrentUser({ as: 'orderedFrom' })],
    update: [
      authenticate('jwt'),
      restrictToOwner({ ownerField: 'orderedFrom' }),
    ],
    patch: [
      authenticate('jwt'),
      restrictToOwner({ ownerField: 'orderedFrom' }),
    ],
    remove: [
      authenticate('jwt'),
      restrictToOwner({ ownerField: 'orderedFrom' }),
    ],
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
