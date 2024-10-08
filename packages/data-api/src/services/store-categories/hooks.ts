import { disallow } from 'feathers-hooks-common';
import { sdk } from '@la-mk/la-sdk';
import { validate } from '../../common/hooks/db';

export const hooks = {
  before: {
    all: [],
    find: [],
    get: [],
    // We only allow adding or removing categories by hook when adding, modifying, or removing a product
    create: [disallow('external'), validate(sdk.storeCategory.validate)],
    patch: [disallow('external'), validate(sdk.storeCategory.validate)],
    remove: [disallow('external')],
  },
};
