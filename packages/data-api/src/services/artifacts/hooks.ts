import { disallow } from 'feathers-hooks-common';
import * as feathersAuthentication from '@feathersjs/authentication';
import { setCurrentUser, queryWithCurrentUser } from '../../common/hooks/auth';

const { authenticate } = feathersAuthentication.hooks;

export const hooks = {
  before: {
    find: [disallow()],
    get: [disallow()],
    create: [authenticate('jwt'), setCurrentUser(['storeId'])],
    patch: [disallow()],
    remove: [authenticate('jwt'), queryWithCurrentUser(['storeId'])],
  },
};
