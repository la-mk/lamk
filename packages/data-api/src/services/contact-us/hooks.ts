import { disallow } from 'feathers-hooks-common';
import { validate } from '../../common/hooks/db';
import { sdk } from '@sradevski/la-sdk';

export const hooks = {
  before: {
    all: [],
    find: [disallow('external')],
    get: [disallow('external')],
    create: [validate(sdk.contactUs.validate)],
    patch: [disallow('external')],
    remove: [disallow('external')],
  },
};
