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
import { settableFields } from '../../common/hooks/filtering';
import { getEmailTemplate } from '../email/templateProcessor';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { t } from '../../common/i18n';

const promisifiedRandomBytes = util.promisify(crypto.randomBytes);

interface CustomHookContext extends HookContext {
  custom?: {
    storeId: string;
  };
}

const getStore = async (ctx: CustomHookContext): Promise<Store | null> => {
  const storeId = ctx.custom?.storeId;
  if (!storeId) {
    return null;
  }

  return await ctx.app.services['stores'].get(storeId);
};

export const handleResetToken = async (ctx: CustomHookContext) => {
  checkContext(ctx, 'after', ['patch']);
  const authManagement = Array.isArray(ctx.result) ? ctx.result[0] : ctx.result;
  const storeInfo = await getStore(ctx);
  const storeDomain = storeInfo
    ? storeInfo.customDomain || `${storeInfo.slug}.la.mk`
    : undefined;

  const templateData = {
    storeName: storeInfo?.name ?? 'admin.la.mk',
    storeUrl: `https://${storeDomain ?? 'admin.la.mk'}`,
    resetLink: storeDomain
      ? `https://${storeDomain}/auth/resetPassword?resetToken=${authManagement?.resetToken}`
      : `https://admin.la.mk/resetPassword?resetToken=${authManagement?.resetToken}`,
  };

  if (authManagement?.resetToken && authManagement?.email) {
    await ctx.app.services['email'].create({
      from: 'noreply@la.mk',
      to: authManagement.email,
      subject: `la.mk - ${t('auth.resetPassword')}`,
      html: await getEmailTemplate('reset-password', templateData),
      text: `
        Reset your password

        You have requested a password reset for ${authManagement.email}.

        You can reset your password by clicking on https://admin.la.mk/resetPassword?resetToken=${authManagement.resetToken}
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

export const handleExternalPatch = async (ctx: CustomHookContext) => {
  checkContext(ctx, 'before', ['patch']);
  const { email } = ctx.params.query ?? {};
  if (!email) {
    throw new BadRequest('Email query parameter is required');
  }

  if (ctx.params.query?.storeId) {
    ctx.custom = {
      storeId: ctx.params.query.storeId as string,
    };

    delete ctx.params.query.storeId;
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
        settableFields(['resetToken', 'modifiedAt']),
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
    patch: [handleResetToken, allowFields([], [])],
    remove: [allowFields([], [])],
  },
};
