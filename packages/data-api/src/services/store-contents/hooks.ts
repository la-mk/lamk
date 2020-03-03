import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import { requireAnyQueryParam } from '../../common/hooks/filtering';
import { disallow } from 'feathers-hooks-common';
import { sdk } from '@sradevski/la-sdk';
import { validate, unique } from '../../common/hooks/db';
import { queryWithCurrentUser } from '../../common/hooks/auth';

export const hooks = {
  before: {
    all: [],
    find: [requireAnyQueryParam(['forStore'])],
    get: [],
    // We create store contents on store creation
    create: [disallow('external')],
    patch: [
      authenticate('jwt'),
      queryWithCurrentUser(['forStore']),
      validate(sdk.storeContents.validate),
      unique(['forStore']),
    ],
    remove: [disallow('external')],
  },

  // TODO: Maybe make content not accessible if the store is not published, although it is not very critical.
};
