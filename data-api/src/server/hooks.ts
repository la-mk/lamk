// Application hooks that run for every service
import { log } from '../common/hooks/log';
import { Application, HooksObject } from '@feathersjs/feathers';
import {
  appendCreateTimestamp,
  appendModifyTimestamp,
} from '../common/hooks/timestamps';
import { convertQueryObjectId } from '../common/hooks/mongo';

const hooks: HooksObject = {
  before: {
    all: [log, convertQueryObjectId],
    find: [],
    get: [],
    create: [appendCreateTimestamp],
    update: [],
    patch: [appendModifyTimestamp],
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
