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
    find: [
      authenticate('jwt'),
      queryWithCurrentUser({ idField: 'owns', as: 'orderedFrom' }),
    ],
    get: [
      authenticate('jwt'),
      queryWithCurrentUser({ idField: 'owns', as: 'orderedFrom' }),
    ],
    create: [
      authenticate('jwt'),
      associateCurrentUser({ idField: 'owns', as: 'orderedFrom' }),
    ],
    update: [
      authenticate('jwt'),
      restrictToOwner({ idField: 'owns', ownerField: 'orderedFrom' }),
    ],
    patch: [
      authenticate('jwt'),
      restrictToOwner({ idField: 'owns', ownerField: 'orderedFrom' }),
    ],
    remove: [
      authenticate('jwt'),
      restrictToOwner({ idField: 'owns', ownerField: 'orderedFrom' }),
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
