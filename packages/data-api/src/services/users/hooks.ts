import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import { validate, unique, setFields } from '../../common/hooks/db';
import { sdk } from '@sradevski/la-sdk';
import { createCartForUser, removeCartForUser } from './serviceHooks/carts';
import { queryWithCurrentUser } from '../../common/hooks/auth';
import {
  createAuthManagementForUser,
  hasEmailAndValidResetToken,
  removeAuthManagementForUser,
} from './serviceHooks/authManagement';
import { patchableFields } from '../../common/hooks/filtering';
import { unless } from 'feathers-hooks-common';

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

export const hooks = {
  before: {
    all: [],
    find: [authenticate('jwt'), queryWithCurrentUser(['_id'])],
    get: [authenticate('jwt'), queryWithCurrentUser(['_id'])],
    create: [
      hashPassword('password'),
      setFields({ isEmailVerified: false }),
      validate(sdk.user.validate),
      unique(['email']),
    ],
    patch: [
      // If it has valid password reset token, allow to patch.
      unless(
        // This requires both email query and a valid reset token
        hasEmailAndValidResetToken,
        authenticate('jwt'),
        queryWithCurrentUser(['_id']),
      ),

      // For now we don't allow changing an email, once we do we need to reset isEmailVerified.
      patchableFields([
        'firstName',
        'lastName',
        'phoneNumber',
        'password',
        'modifiedAt',
      ]),
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
    create: [createCartForUser, createAuthManagementForUser],
    patch: [],
    remove: [removeCartForUser, removeAuthManagementForUser],
  },
};
