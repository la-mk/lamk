import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import { requireAnyQueryParam } from '../../common/hooks/filtering';
import { sdk } from '@sradevski/la-sdk';
import { validate } from '../../common/hooks/db';
import { setCurrentUser, queryWithCurrentUser } from '../../common/hooks/auth';

export const hooks = {
  before: {
    all: [],
    find: [requireAnyQueryParam(['forStore'])],
    get: [],
    create: [
      authenticate('jwt'),
      setCurrentUser(['forStore']),
      // @ts-ignore
      validate(sdk.storePaymentMethods.validate),
    ],
    patch: [
      authenticate('jwt'),
      queryWithCurrentUser(['forStore']),
      // @ts-ignore
      validate(sdk.storePaymentMethods.validate),
    ],
    remove: [authenticate('jwt'), queryWithCurrentUser(['forStore'])],
  },
};
