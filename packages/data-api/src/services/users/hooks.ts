import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import { validate, unique } from '../../common/hooks/db';
import { sdk } from '@sradevski/la-sdk';
import { createCartForUser, removeCartForUser } from './serviceHooks/carts';
import { queryWithCurrentUser } from '../../common/hooks/auth';

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

export const hooks = {
  before: {
    all: [],
    find: [authenticate('jwt'), queryWithCurrentUser(['_id'])],
    get: [authenticate('jwt'), queryWithCurrentUser(['_id'])],
    create: [
      hashPassword('password'),
      validate(sdk.user.validate),
      unique(['email']),
    ],
    patch: [
      authenticate('jwt'),
      queryWithCurrentUser(['_id']),
      hashPassword('password'),
      validate(sdk.user.validate),
      unique(['email']),
    ],
    remove: [authenticate('jwt'), queryWithCurrentUser(['_id'])],
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'),
    ],
    find: [],
    get: [],
    create: [createCartForUser],
    patch: [],
    remove: [removeCartForUser],
  },
};
