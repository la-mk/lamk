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
      queryWithCurrentUser({ idField: 'owns', as: 'forStore' }),
    ],
    get: [
      authenticate('jwt'),
      queryWithCurrentUser({ idField: 'owns', as: 'forStore' }),
    ],
    create: [
      authenticate('jwt'),
      associateCurrentUser({ idField: 'owns', as: 'forStore' }),
    ],
    update: [
      authenticate('jwt'),
      restrictToOwner({ idField: 'owns', ownerField: 'forStore' }),
    ],
    patch: [
      authenticate('jwt'),
      restrictToOwner({ idField: 'owns', ownerField: 'forStore' }),
    ],
    remove: [
      authenticate('jwt'),
      restrictToOwner({ idField: 'owns', ownerField: 'forStore' }),
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
