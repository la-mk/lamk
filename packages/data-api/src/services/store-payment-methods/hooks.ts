import * as _ from 'lodash';
import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import { requireAnyQueryParam } from '../../common/hooks/filtering';
import { sdk } from '@sradevski/la-sdk';
import { validate } from '../../common/hooks/db';
import { queryWithCurrentUser, isOwner } from '../../common/hooks/auth';
import {
  disallow,
  unless,
  isProvider,
  checkContext,
} from 'feathers-hooks-common';
import { HookContext } from '@feathersjs/feathers';
import { PaymentMethod } from '@sradevski/la-sdk/dist/models/storePaymentMethods';

const clearStoreKey = (ctx: HookContext) => {
  checkContext(ctx, 'after');
  (ctx.result?.data?.[0]?.methods ?? []).forEach((method: PaymentMethod) => {
    _.unset(method, 'clientKey');
  });
};

export const hooks = {
  before: {
    all: [],
    find: [requireAnyQueryParam(['forStore'])],
    get: [],
    // We create store payment methods on store creation
    create: [disallow('external'), validate(sdk.storePaymentMethods.validate)],
    patch: [
      authenticate('jwt'),
      queryWithCurrentUser(['forStore']),
      validate(sdk.storePaymentMethods.validate),
    ],
    remove: [disallow('external')],
  },

  // clientKey is sensitive information so we want to filter that out.
  after: {
    all: [],
    find: [
      unless(
        (...args) =>
          isProvider('server')(...args) || isOwner(['forStore'])(...args),
        clearStoreKey,
      ),
    ],
    get: [
      unless(
        (...args) =>
          isProvider('server')(...args) || isOwner(['forStore'])(...args),
        clearStoreKey,
      ),
    ],
    create: [],
    patch: [],
    remove: [],
  },
};
