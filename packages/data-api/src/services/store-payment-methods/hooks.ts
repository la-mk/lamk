import * as _ from 'lodash';
import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import { requireAnyQueryParam } from '../../common/hooks/filtering';
import { sdk } from '@la-mk/la-sdk';
import { validate } from '../../common/hooks/db';
import { queryWithCurrentUser, isOwner } from '../../common/hooks/auth';
import {
  disallow,
  unless,
  isProvider,
  checkContext,
} from 'feathers-hooks-common';
import { HookContext } from '@feathersjs/feathers';
import {
  PaymentMethod,
  StorePaymentMethods,
} from '@la-mk/la-sdk/dist/models/storePaymentMethods';
import { BadRequest } from '../../common/errors';
import { v4 as uuid } from 'uuid';
import * as nestpay from '../../common/paymentProcessors/nestpay';

// TODO: Rate-limit this so store keys cannot leak.
// This is a bit hacky approach to having calculated values but it is the cleanest approach for now.
const returnHashIfRequested = async (ctx: HookContext) => {
  checkContext(ctx, 'before', 'get');
  const id = ctx.id;
  const { hashParamsVal, methodName } = ctx.params.query ?? {};
  // If hashParamsVal wasn't passed, it means it is a normal get request.
  if (!id || !hashParamsVal || !methodName) {
    return;
  }

  // This is just so we make sure the storeKey cannot be derived by passing a specific hashParamsval combination
  if (hashParamsVal.length < 30) {
    throw new BadRequest(
      'The passed form fields are invalid, check if your payment call is properly configured',
    );
  }

  // Otherwise we need to calculate the hash for the specific payment method and pass it back;
  const storePaymentMethods: StorePaymentMethods = await ctx.app.services[
    'storePaymentMethods'
  ].get(id);
  const processorInfo = storePaymentMethods?.methods.find(
    method => method.name === methodName,
  );

  if (!processorInfo?.clientKey) {
    throw new BadRequest('The store does not support credit card payments');
  }

  const randomString = uuid();
  const hash = nestpay.calculateHash(
    processorInfo.clientKey,
    hashParamsVal + randomString,
  );

  ctx.result = { hash, randomString };
};

const clearMethodFields = (ctx: HookContext) => {
  checkContext(ctx, 'after');
  (ctx.result?.data?.[0]?.methods ?? []).forEach((method: PaymentMethod) => {
    _.unset(method, 'clientUsername');
    _.unset(method, 'clientPassword');
    _.unset(method, 'clientKey');
  });
};

export const hooks = {
  before: {
    all: [],
    find: [requireAnyQueryParam(['forStore'])],
    get: [returnHashIfRequested],
    // We create store payment methods on store creation
    create: [disallow('external'), validate(sdk.storePaymentMethods.validate)],
    patch: [
      authenticate('jwt'),
      queryWithCurrentUser(['forStore']),
      validate(sdk.storePaymentMethods.validate),
    ],
    remove: [disallow('external')],
  },

  // clientKey, username, and password are sensitive information so we want to filter that out.
  after: {
    all: [],
    find: [
      unless(
        (...args) =>
          isProvider('server')(...args) || isOwner(['forStore'])(...args),
        clearMethodFields,
      ),
    ],
    get: [
      unless(
        (...args) =>
          isProvider('server')(...args) || isOwner(['forStore'])(...args),
        clearMethodFields,
      ),
    ],
    create: [],
    patch: [],
    remove: [],
  },
};
