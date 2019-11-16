import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import {
  restrictToOwner,
  associateCurrentUser,
} from 'feathers-authentication-hooks';
import { unique } from '../../common/hooks/unique';
import {
  requireAnyQueryParam,
  isOwner,
  isPublished,
} from '../../common/hooks/filtering';
import { unless, keep } from 'feathers-hooks-common';
import { NotFound } from '../../common/errors';
import { sdk } from '@lamk/la-sdk';
import { validate } from '../../common/hooks/db';

export const hooks = {
  before: {
    all: [],
    find: [requireAnyQueryParam(['ownedBy', 'slug'])],
    get: [],
    create: [
      authenticate('jwt'),
      associateCurrentUser({ as: 'ownedBy' }),
      // For a start, we want to have 1:1 mapping between user and store and use the same ID to simplify usage.
      associateCurrentUser({ as: '_id' }),
      // Since we set the same ID as the user, double-check that the ID is unique.
      unique(['_id']),
      validate(sdk.store.validate),
    ],
    patch: [
      authenticate('jwt'),
      restrictToOwner({ ownerField: 'ownedBy' }),
      validate(sdk.store.validate),
    ],
    remove: [authenticate('jwt'), restrictToOwner({ ownerField: 'ownedBy' })],
  },

  after: {
    all: [],
    find: [
      unless(
        isOwner('ownedBy'),
        unless(isPublished(), () => {
          throw new NotFound('Store not found');
        }),
      ),
      unless(
        isOwner('ownedBy'),
        keep('_id', 'name', 'slug', 'logo', 'isPublished', 'ownedBy'),
      ),
    ],
    get: [
      unless(
        isOwner('ownedBy'),
        unless(isPublished(), () => {
          throw new NotFound('Store not found');
        }),
      ),
      unless(
        isOwner('ownedBy'),
        keep('_id', 'name', 'slug', 'logo', 'isPublished', 'ownedBy'),
      ),
    ],
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
