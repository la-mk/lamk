import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import { requireAnyQueryParam } from '../../common/hooks/filtering';
import { sdk } from '@la-mk/la-sdk';
import { validate } from '../../common/hooks/db';
import {
  setCurrentUser,
  queryWithCurrentUser,
  allowFields,
} from '../../common/hooks/auth';

const allowedFields = [
  '_id',
  'method',
  'price',
  'freeDeliveryOver',
  'forStore',
];

export const hooks = {
  before: {
    all: [],
    find: [requireAnyQueryParam(['forStore'])],
    get: [],
    create: [
      authenticate('jwt'),
      setCurrentUser(['forStore']),
      validate(sdk.delivery.validate),
    ],
    patch: [
      authenticate('jwt'),
      queryWithCurrentUser(['forStore']),
      validate(sdk.delivery.validate),
    ],
    remove: [authenticate('jwt'), queryWithCurrentUser(['forStore'])],
  },

  after: {
    all: [],
    find: [allowFields(['forStore'], allowedFields)],
    get: [allowFields(['forStore'], allowedFields)],
    create: [],
    patch: [],
    remove: [],
  },
};
