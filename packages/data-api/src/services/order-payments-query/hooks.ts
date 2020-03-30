import { disallow } from 'feathers-hooks-common';

export const hooks = {
  before: {
    all: [disallow('external')],
    find: [],
    get: [],
    create: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    patch: [],
    remove: [],
  },
};
