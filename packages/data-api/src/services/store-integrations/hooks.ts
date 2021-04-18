import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import { requireAnyQueryParam } from '../../common/hooks/filtering';
import { sdk } from '@la-mk/la-sdk';
import { validate } from '../../common/hooks/db';
import { queryWithCurrentUser, allowFields } from '../../common/hooks/auth';
import { disallow } from 'feathers-hooks-common';

const allowedFields = ['forStore', 'services'];

export const hooks = {
  before: {
    all: [],
    find: [requireAnyQueryParam(['forStore'])],
    get: [],
    create: [disallow('external'), validate(sdk.storeIntegrations.validate)],
    patch: [
      authenticate('jwt'),
      queryWithCurrentUser(['forStore']),
      validate(sdk.storeIntegrations.validate),
    ],
    remove: [disallow('external')],
  },

  after: {
    all: [],
    find: [allowFields(['forStore'], allowedFields)],
    get: [allowFields(['forStore'], allowedFields)],
    create: [],
    patch: [],
    remove: [],
  },
};
