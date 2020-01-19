import { disallow } from 'feathers-hooks-common';
import * as feathersAuthentication from '@feathersjs/authentication';
import {
  associateCurrentUser,
  queryWithCurrentUser,
} from 'feathers-authentication-hooks';

const { authenticate } = feathersAuthentication.hooks;

export const hooks = {
  before: {
    find: [disallow()],
    get: [disallow()],
    create: [authenticate('jwt'), associateCurrentUser({ as: 'storeId' })],
    patch: [disallow()],
    // TODO: Add a `temp` metadata to each image, and remove it once a form has been submitted as part of that form's hook. This will remove any images that were added, but never used.
    remove: [authenticate('jwt'), queryWithCurrentUser({ as: 'storeId' })],
  },
};
