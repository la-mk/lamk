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
      queryWithCurrentUser({ idField: 'owns', as: 'soldBy' }),
    ],
    get: [
      authenticate('jwt'),
      queryWithCurrentUser({ idField: 'owns', as: 'soldBy' }),
    ],
    create: [
      authenticate('jwt'),
      associateCurrentUser({ idField: 'owns', as: 'soldBy' }),
    ],
    update: [
      authenticate('jwt'),
      restrictToOwner({ idField: 'owns', ownerField: 'soldBy' }),
    ],
    patch: [
      authenticate('jwt'),
      restrictToOwner({ idField: 'owns', ownerField: 'soldBy' }),
    ],
    remove: [
      authenticate('jwt'),
      restrictToOwner({ idField: 'owns', ownerField: 'soldBy' }),
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
