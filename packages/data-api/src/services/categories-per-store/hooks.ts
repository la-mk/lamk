import { disallow } from 'feathers-hooks-common';
import { sdk } from '@sradevski/la-sdk';
import { validate } from '../../common/hooks/db';

export const hooks = {
  before: {
    all: [],
    find: [],
    get: [],
    // We only allow adding or removing categories by hook when adding, modifying, or removing a product
    create: [disallow('external'), validate(sdk.category.validate)],
    patch: [disallow('external'), validate(sdk.category.validate)],
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
