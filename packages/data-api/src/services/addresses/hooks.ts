import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import { alterItems } from 'feathers-hooks-common';
import { sdk } from '@la-mk/la-sdk';
import { validate } from '../../common/hooks/db';
import { queryWithCurrentUser, setCurrentUser } from '../../common/hooks/auth';

export const hooks = {
  before: {
    all: [],
    find: [authenticate('jwt'), queryWithCurrentUser(['addressFor'])],
    get: [authenticate('jwt'), queryWithCurrentUser(['addressFor'])],
    // We only support shipping to Macedonia so far.
    create: [
      authenticate('jwt'),
      setCurrentUser(['addressFor']),
      alterItems(record => {
        record.country = 'MK';
      }),
      validate(sdk.address.validate),
    ],
    patch: [
      authenticate('jwt'),
      queryWithCurrentUser(['addressFor']),
      alterItems(record => {
        record.country = 'MK';
      }),
      validate(sdk.address.validate),
    ],
    remove: [authenticate('jwt'), queryWithCurrentUser(['addressFor'])],
  },
};
