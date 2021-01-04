import * as feathersAuthentication from '@feathersjs/authentication';
import { disallow } from 'feathers-hooks-common';
import { sdk } from '@la-mk/la-sdk';
import { validate } from '../../common/hooks/db';
import { queryWithCurrentUser } from '../../common/hooks/auth';
const { authenticate } = feathersAuthentication.hooks;

export const hooks = {
  before: {
    all: [],
    // Only owners can fetch product groups
    find: [authenticate('jwt'), queryWithCurrentUser(['forStore'])],
    get: [authenticate('jwt'), queryWithCurrentUser(['forStore'])],
    // We only allow adding or removing categories by hook when adding, modifying, or removing a product
    create: [disallow('external'), validate(sdk.productGroup.validate)],
    patch: [disallow('external'), validate(sdk.productGroup.validate)],
    remove: [disallow('external')],
  },
};
