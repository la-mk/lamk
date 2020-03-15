import { disallow, checkContext } from 'feathers-hooks-common';
import { requireAllQueryParams } from '../../common/hooks/filtering';
import { authenticate } from '@feathersjs/authentication/lib/hooks';
import { queryWithCurrentUser } from '../../common/hooks/auth';
import { HookContext } from '@feathersjs/feathers';

const convertGetToStandardResponse = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['get']);
  const { result, params } = ctx;
  const type = params.query?.type ?? 'unknown';
  ctx.result = { [type]: result };
};

export const hooks = {
  before: {
    all: [],
    find: [disallow('external')],
    get: [
      authenticate('jwt'),
      queryWithCurrentUser(['forStore']),
      requireAllQueryParams(['type', 'forStore']),
    ],
    create: [disallow('external')],
    patch: [disallow('external')],
    remove: [disallow('external')],
  },

  after: {
    all: [],
    find: [],
    get: [convertGetToStandardResponse],
    create: [],
    patch: [],
    remove: [],
  },
};
