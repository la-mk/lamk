import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import { requireAnyQueryParam } from '../../common/hooks/filtering';
import { sdk } from '@sradevski/la-sdk';
import { validate } from '../../common/hooks/db';
import { queryWithCurrentUser } from '../../common/hooks/auth';
import { disallow } from 'feathers-hooks-common';

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
};
