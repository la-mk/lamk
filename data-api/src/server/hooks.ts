// Application hooks that run for every service
import { log } from '../common/hooks/log';
import { Application, HooksObject } from '@feathersjs/feathers';
import {
  appendCreateTimestamp,
  appendModifyTimestamp,
} from '../common/hooks/timestamps';
import { appendId } from '../common/hooks/db';

const hooks: HooksObject = {
  before: {
    all: [log],
    find: [],
    get: [],
    // We append a custom UUID in order to avoid depending on ObjectIDs from MongoDB and to make future migrations easier.
    create: [appendCreateTimestamp, appendId],
    update: [appendModifyTimestamp],
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
