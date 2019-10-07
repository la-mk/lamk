import { disallow } from 'feathers-hooks-common';

export const hooks = {
  before: {
    all: [],
    find: [],
    get: [],
    // We only allow adding or removing categories by hook when adding, modifying, or removing a product
    create: [disallow('external')],
    patch: [disallow()],
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
