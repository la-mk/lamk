import { disallow } from 'feathers-hooks-common';

export const hooks = {
  before: {
    all: [],
    find: [],
    get: [],
    // For now, we only allow for manual modifications directly in the DB.
    create: [disallow()],
    patch: [disallow()],
    remove: [disallow()],
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
