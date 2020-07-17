import {
  disallow,
  checkContext,
  unless,
  isProvider,
} from 'feathers-hooks-common';
import { sdk } from '@sradevski/la-sdk';
import * as crypto from 'crypto';
import * as util from 'util';
import { validate, unique } from '../../common/hooks/db';
import { allowFields } from '../../common/hooks/auth';
import { HookContext } from '@feathersjs/feathers';
import { AuthManagement } from '@sradevski/la-sdk/dist/models/authManagement';
import { BadRequest } from '../../common/errors';
import { patchableFields } from '../../common/hooks/filtering';

const promisifiedRandomBytes = util.promisify(crypto.randomBytes);

// TODO: Create nice html templates before using this.
export const handleResetToken = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['patch']);
  const authManagement = Array.isArray(ctx.result) ? ctx.result[0] : ctx.result;

  if (authManagement.resetToken) {
    await ctx.app.services['email'].create({
      from: 'noreply@la.mk',
      to: authManagement.email,
      subject: 'la.mk - Reset password',
      text: `
        You have requested a password reset for ${authManagement.email}. You can reset your password by clicking https://admin.la.mk/account/reset/${authManagement.resetToken}
      `,
    });
  }
};

const getToken = async (size: number) => {
  const randomBytes = await promisifiedRandomBytes(size);
  return randomBytes.toString('hex');
};

// FUTURE: Consider hashing the tokens, just for some added security (although it is not that big of a deal if we don't, especially if we support 2fa later on)
const getUpdatedData = async (
  patchData: Partial<AuthManagement>,
): Promise<Partial<AuthManagement> | null> => {
  if (patchData.resetToken) {
    return {
      resetToken: await getToken(32),
      resetTokenCreatedAt: new Date(Date.now()).toISOString(),
    };
  }

  if (patchData.verifyToken) {
    return {
      verifyToken: await getToken(32),
      verifyTokenCreatedAt: new Date(Date.now()).toISOString(),
    };
  }

  return null;
};

export const handleExternalPatch = async (ctx: HookContext) => {
  checkContext(ctx, 'before', ['patch']);
  const { email } = ctx.params.query ?? {};
  if (!email) {
    throw new BadRequest('Email query parameter is required');
  }

  ctx.data = {
    ...ctx.data,
    ...((await getUpdatedData(ctx.data)) ?? {}),
  };
};

export const hooks = {
  before: {
    all: [],
    find: [disallow('external')],
    get: [disallow('external')],
    create: [
      disallow('external'),
      validate(sdk.authManagement.validate),
      unique(['email']),
    ],
    patch: [
      unless(
        (...args) => isProvider('server')(...args),
        patchableFields(['resetToken', 'modifiedAt']),
      ),
      handleExternalPatch,
      validate(sdk.authManagement.validate),
    ],
    remove: [disallow('external')],
  },

  after: {
    all: [],
    find: [allowFields([], [])],
    get: [allowFields([], [])],
    create: [allowFields([], [])],
    patch: [/*handleResetToken,*/ allowFields([], [])],
    remove: [allowFields([], [])],
  },
};
