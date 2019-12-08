import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import { unique } from '../../common/hooks/unique';
import {
  queryWithCurrentUser,
  restrictToOwner,
} from 'feathers-authentication-hooks';
import { validate } from '../../common/hooks/db';
import { sdk } from '@sradevski/la-sdk';

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

export const hooks = {
  before: {
    all: [],
    find: [authenticate('jwt'), queryWithCurrentUser({ as: '_id' })],
    get: [authenticate('jwt'), queryWithCurrentUser({ as: '_id' })],
    create: [
      hashPassword('password'),
      unique(['email']),
      validate(sdk.user.validate),
    ],
    patch: [
      hashPassword('password'),
      authenticate('jwt'),
      restrictToOwner({ ownerField: '_id' }),
      unique(['email']),
      validate(sdk.user.validate),
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
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    patch: [],
    remove: [],
  },
};
