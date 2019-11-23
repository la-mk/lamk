import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import { restrictToOwner } from 'feathers-authentication-hooks';
import { requireAnyQueryParam } from '../../common/hooks/filtering';
import { disallow } from 'feathers-hooks-common';
import { sdk } from '@lamk/la-sdk';
import { validate } from '../../common/hooks/db';
import { unique } from '../../common/hooks/unique';

export const hooks = {
  before: {
    all: [],
    find: [requireAnyQueryParam(['forStore'])],
    get: [],
    create: [disallow('external')],
    patch: [
      authenticate('jwt'),
      restrictToOwner({ ownerField: 'forStore' }),
      unique(['forStore']),
      validate(sdk.storeContents.validate),
    ],
    remove: [disallow('external')],
  },

  // TODO: Maybe make content not accessible if the store is not published, although it is not very critical.
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
    patch: [],
    remove: [],
  },
};
