import { disallow } from 'feathers-hooks-common';
import { validate } from '../../common/hooks/db';
import { sdk } from '@lamk/la-sdk';

export const hooks = {
  before: {
    all: [],
    find: [],
    get: [],
    // For now, we only allow for manual modifications directly in the DB.
    create: [disallow(), validate(sdk.category.validate)],
    patch: [disallow(), validate(sdk.category.validate)],
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
