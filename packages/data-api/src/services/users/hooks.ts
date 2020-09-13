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
import { settableFields } from '../../common/hooks/filtering';
import { unless, checkContext } from 'feathers-hooks-common';
import { HookContext } from '@feathersjs/feathers';
import { BadRequest } from '../../common/errors';

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

const comparePasswordsIfPatched = async (ctx: HookContext) => {
  checkContext(ctx, null, 'patch');
  // If it is not patching the password, or if it is patching it from a forgot password form, skip the password comparison.
  if (!ctx.data.password || !ctx.id) {
    return;
  }

  const { currentPassword } = ctx.data;
  delete ctx.data.currentPassword;

  if (!currentPassword) {
    throw new BadRequest('You need to provide the current password');
  }

  const user = await ctx.app.services['users'].get(ctx.id);
  const localStrategy = ctx.app.services['authentication'].getStrategies([
    'local',
  ])[0] as local.LocalStrategy;

  try {
    await localStrategy.comparePassword(user, currentPassword);
  } catch (err) {
    throw new BadRequest("The current passwords don't match");
  }
};

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

      comparePasswordsIfPatched,
      // For now we don't allow changing an email, once we do we need to reset isEmailVerified.
      settableFields([
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
