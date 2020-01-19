import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import {
  restrictToOwner,
  associateCurrentUser,
  queryWithCurrentUser,
} from 'feathers-authentication-hooks';
import { alterItems, discard } from 'feathers-hooks-common';
import { sdk } from '@sradevski/la-sdk';
import { validate } from '../../common/hooks/db';

export const hooks = {
  before: {
    all: [],
    find: [authenticate('jwt'), queryWithCurrentUser({ as: 'addressFor' })],
    get: [authenticate('jwt'), queryWithCurrentUser({ as: 'addressFor' })],
    // We only support shipping to Macedonia so far.
    create: [
      authenticate('jwt'),
      associateCurrentUser({ as: 'addressFor' }),
      alterItems(record => {
        record.country = 'MK';
      }),
      validate(sdk.address.validate),
    ],
    patch: [
      authenticate('jwt'),
      restrictToOwner({ ownerField: 'addressFor' }),
      discard('_id'),
      alterItems(record => {
        record.country = 'MK';
      }),
      validate(sdk.address.validate),
    ],
    remove: [
      authenticate('jwt'),
      restrictToOwner({ ownerField: 'addressFor' }),
    ],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
