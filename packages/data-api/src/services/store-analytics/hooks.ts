import { disallow, checkContext } from 'feathers-hooks-common';
import { requireAllQueryParams } from '../../common/hooks/filtering';
import { authenticate } from '@feathersjs/authentication/lib/hooks';
import { queryWithCurrentUser } from '../../common/hooks/auth';
import { HookContext } from '@feathersjs/feathers';
import { validate } from '../../common/hooks/db';
import { sdk } from '@la-mk/la-sdk';
import { AnalyticsFrequency } from '@la-mk/la-sdk/dist/models/storeAnalytics';

const convertGetToStandardResponse = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['get']);
  const { result, params } = ctx;
  const type = params.query?.type ?? 'unknown';
  ctx.result = { [type]: result };
};

const limitQuery = (ctx: HookContext) => {
  checkContext(ctx, 'before', ['get']);
  if (!ctx.params.query) {
    ctx.params.query = {};
  }

  ctx.params.query.$sort = { timestamp: -1 };
  const frequency: AnalyticsFrequency | undefined = ctx.params.query.frequency;
  switch (frequency) {
    case sdk.storeAnalytics.AnalyticsFrequency.MONTHLY: {
      ctx.params.query.$limit = 13;
      return;
    }
    case sdk.storeAnalytics.AnalyticsFrequency.WEEKLY: {
      ctx.params.query.$limit = 13;
      return;
    }
    case sdk.storeAnalytics.AnalyticsFrequency.DAILY: {
      ctx.params.query.$limit = 32;
      return;
    }
    case sdk.storeAnalytics.AnalyticsFrequency.HOURLY: {
      ctx.params.query.$limit = 25;
      return;
    }
  }
};

export const hooks = {
  before: {
    all: [],
    find: [disallow('external')],
    get: [
      authenticate('jwt'),
      queryWithCurrentUser(['forStore']),
      requireAllQueryParams(['type', 'forStore']),
      limitQuery,
    ],
    create: [disallow('external'), validate(sdk.storeAnalytics.validate)],
    patch: [disallow('external'), validate(sdk.storeAnalytics.validate)],
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
