import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import { unique } from '../../common/hooks/unique';

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

export const hooks = {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [unique(['email']), hashPassword('password')],
    update: [unique(['email']), hashPassword('password'), authenticate('jwt')],
    patch: [unique(['email']), hashPassword('password'), authenticate('jwt')],
    remove: [authenticate('jwt')],
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
