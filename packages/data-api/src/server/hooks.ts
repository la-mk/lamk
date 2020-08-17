// Application hooks that run for every service
import { log } from '../common/hooks/log';
import { error } from '../common/hooks/error';
import { Application, HooksObject } from '@feathersjs/feathers';
import {
  appendCreateTimestamp,
  appendModifyTimestamp,
} from '../common/hooks/timestamps';
import { appendId } from '../common/hooks/db';
import { disallow, discard } from 'feathers-hooks-common';

const hooks: HooksObject = {
  before: {
    all: [log],
    find: [],
    get: [],
    // We append a custom UUID in order to avoid depending on ObjectIDs from MongoDB and to make future migrations easier.
    create: [appendCreateTimestamp, appendId],
    // We only want to support `patch` requests, as PUT is not as useful.
    update: [disallow()],
    // IDs cannot be patched, so we remove them from the data
    patch: [appendModifyTimestamp, discard('_id')],
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
    all: [log, error],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};

export const registerAppHooks = (app: Application) => app.hooks(hooks);
