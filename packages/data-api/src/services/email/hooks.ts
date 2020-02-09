import { disallow } from 'feathers-hooks-common';

export const hooks = {
  before: {
    all: [],
    find: [disallow()],
    get: [disallow()],
    // FUTURE: We need to do some validation here, but the 3rd-party service we use already does that internally so it's fine for now.
    create: [disallow('external')],
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
