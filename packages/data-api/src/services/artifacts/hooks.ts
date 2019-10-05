import { disallow } from "feathers-hooks-common";
import * as feathersAuthentication from '@feathersjs/authentication';

const { authenticate } = feathersAuthentication.hooks;

export const hooks = {
  before: {
    find: [disallow()],
    get: [disallow()],
    create: [authenticate('jwt')],
    patch: [disallow()],
    // TODO: Only allow owner of image to remove it. We can add a `owner` metadata tag to each image (where owner is store) and only that store can remove it
    // TODO: Add a `temp` metadata to each image, and remove it once a form has been submitted as part of that form's hook. This will remove any images that were added, but never used.
    remove: [authenticate('jwt')],
  },
};
