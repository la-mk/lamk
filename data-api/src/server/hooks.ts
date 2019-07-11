// Application hooks that run for every service
import { log } from '../common/hooks/log';
import { Application, HooksObject } from '@feathersjs/feathers';

const hooks: HooksObject = {
  before: {
    all: [log],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [log],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [log],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};

export const registerAppHooks = (app: Application) => app.hooks(hooks);
