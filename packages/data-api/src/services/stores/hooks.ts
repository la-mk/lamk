import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import {
  requireAnyQueryParam,
  isPublished,
} from '../../common/hooks/filtering';
import { unless, disallow, checkContext } from 'feathers-hooks-common';
import { NotFound } from '../../common/errors';
import { sdk } from '@la-mk/la-sdk';
import { validate, unique } from '../../common/hooks/db';
import {
  createStoreContentsIfNotExists,
  removeStoreContents,
} from './serviceHooks/storeContents';
import {
  setCurrentUser,
  queryWithCurrentUser,
  allowFields,
  isOwner,
} from '../../common/hooks/auth';
import {
  createStorePaymentMethodsIfNotExists,
  removeStorePaymentMethods,
} from './serviceHooks/storePaymentMethods';
import loadEnv from '../../common/env';
import { HookContext } from '@feathersjs/feathers';
import { t } from '../../common/i18n';
import { getEmailTemplate } from '../email/templateProcessor';
import { logger } from '../../common/logger';
import {
  createStoreIntegrationsIfNotExists,
  removeStoreIntegrations,
} from './serviceHooks/storeIntegrations';

// TODO: We don't have to wait when sending an email, but this will do for now.
export const sendWelcomeEmail = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['create']);
  const user = await ctx.app.services['users'].get(ctx.params.user?._id ?? '');

  if (!user || !user.email) {
    logger.error(
      "Couldn't find user while trying to send welcome email on store creation",
    );
    return;
  }

  try {
    await ctx.app.services['email'].create({
      from: { email: 'noreply@la.mk', name: 'la.mk' },
      to: user.email,
      subject: t('store.welcomeToLamk'),
      html: await getEmailTemplate('welcome-store', {}),
      text: `
        Welcome to la.mk!
        Thanks for joining us! Now that you've created your store, it's time to add products, set up your delivery, payment methods, and finally, start selling.
      `,
    });
  } catch (err) {
    logger.error(err.message);
  }
};

const allowedFields = [
  '_id',
  'name',
  'slug',
  'customDomain',
  'preferences',
  'logo',
  'color',
  'slogan',
  'isPublished',
  'ownedBy',
  'contact',
  'company',
];

const transform = async (ctx: HookContext) => {
  if (ctx.data?.slug) {
    ctx.data.slug = ctx.data.slug.toLowerCase();
  }
};

export const hooks = {
  before: {
    all: [],
    find: [requireAnyQueryParam(['ownedBy', 'slug', 'customDomain'])],
    get: [],
    create: [
      ...(loadEnv().ENABLE_SIGNUP ? [] : [disallow('external')]),
      // We currently don't allow registrations while we are in alpha.
      // disallow('external'),
      authenticate('jwt'),
      // For a start, we want to have 1:1 mapping between user and store and use the same ID to simplify usage.
      setCurrentUser(['_id', 'ownedBy']),
      transform,
      validate(sdk.store.validate),
      // Since we set the same ID as the user, double-check that the ID is unique.
      unique(['_id']),
    ],
    patch: [
      authenticate('jwt'),
      queryWithCurrentUser(['ownedBy']),
      transform,
      validate(sdk.store.validate),
    ],
    remove: [authenticate('jwt'), queryWithCurrentUser(['ownedBy'])],
  },

  after: {
    all: [],
    find: [
      unless(
        isOwner(['ownedBy']),
        unless(isPublished(), () => {
          throw new NotFound('Store not found');
        }),
      ),
      allowFields(['ownedBy'], allowedFields),
    ],
    get: [
      unless(
        isOwner(['ownedBy']),
        unless(isPublished(), () => {
          throw new NotFound('Store not found');
        }),
      ),
      allowFields(['ownedBy'], allowedFields),
    ],
    create: [
      createStoreContentsIfNotExists,
      createStorePaymentMethodsIfNotExists,
      createStoreIntegrationsIfNotExists,
      sendWelcomeEmail,
    ],
    patch: [],
    remove: [
      removeStoreContents,
      removeStorePaymentMethods,
      removeStoreIntegrations,
    ],
  },
};
