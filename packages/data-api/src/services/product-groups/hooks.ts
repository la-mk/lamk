import * as feathersAuthentication from '@feathersjs/authentication';
import { restrictToOwner } from 'feathers-authentication-hooks';
import { disallow } from 'feathers-hooks-common';
import { sdk } from '@sradevski/la-sdk';
import { validate } from '../../common/hooks/db';
const { authenticate } = feathersAuthentication.hooks;

export const hooks = {
  before: {
    all: [],
    find: [authenticate('jwt'), restrictToOwner({ ownerField: 'forStore' })],
    get: [authenticate('jwt'), restrictToOwner({ ownerField: 'forStore' })],
    // We only allow adding or removing categories by hook when adding, modifying, or removing a product
    create: [disallow('external'), validate(sdk.productGroup.validate)],
    patch: [disallow('external'), validate(sdk.productGroup.validate)],
    remove: [disallow('external')],
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
    patch: [],
    remove: [],
  },
};
