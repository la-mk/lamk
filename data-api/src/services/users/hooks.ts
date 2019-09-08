import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import { unique } from '../../common/hooks/unique';
import {
  queryWithCurrentUser,
  restrictToOwner,
} from 'feathers-authentication-hooks';

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

export const hooks = {
  before: {
    all: [],
    find: [authenticate('jwt'), queryWithCurrentUser({ as: '_id' })],
    get: [authenticate('jwt'), queryWithCurrentUser({ as: '_id' })],
    create: [hashPassword('password'), unique(['email'])],
    update: [
      hashPassword('password'),
      authenticate('jwt'),
      restrictToOwner({ ownerField: '_id' }),
      unique(['email']),
    ],
    patch: [
      hashPassword('password'),
      authenticate('jwt'),
      restrictToOwner({ ownerField: '_id' }),
      unique(['email']),
    ],
    remove: [authenticate('jwt'), restrictToOwner({ ownerField: '_id' })],
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'),
    ],
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
