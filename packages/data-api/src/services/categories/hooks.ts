import { disallow } from 'feathers-hooks-common';
import { validate } from '../../common/hooks/db';
import { sdk } from '@sradevski/la-sdk';

export const hooks = {
  before: {
    all: [],
    find: [],
    get: [],
    // For now, we only allow for manual modifications directly in the DB.
    create: [disallow('external'), validate(sdk.category.validate)],
    patch: [disallow('external'), validate(sdk.category.validate)],
    remove: [disallow('external')],
  },
};
