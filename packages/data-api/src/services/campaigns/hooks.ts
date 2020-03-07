import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import { requireAnyQueryParam } from '../../common/hooks/filtering';
import { sdk } from '@sradevski/la-sdk';
import { validate } from '../../common/hooks/db';
import {
  setCurrentUser,
  queryWithCurrentUser,
  allowFields,
} from '../../common/hooks/auth';
import { HookContext } from '@feathersjs/feathers';
import { checkContext } from 'feathers-hooks-common';
import { BadRequest } from '../../common/errors';

const allowedFields = [
  '_id',
  'forStore',
  'name',
  'validFrom',
  'validTo',
  'isPromoted',
  'type',
  'reward',
  'productRules',
];

const ACTIVE_CAMPAIGNS_LIMIT = 10;

const validateNumActiveCampaigns = async (ctx: HookContext) => {
  checkContext(ctx, 'before', ['create', 'patch']);
  const campaign = ctx.data;
  // If there was no change to isActive, or is false, we don't need to check.
  if (!campaign.isActive) {
    return;
  }

  // This won't be correct on concurrent requests, but it's not a big deal.
  const campaignsForStore = await ctx.app.services['campaigns'].find({
    query: {
      forStore: campaign.forStore ?? ctx.params.query?.forStore,
      isActive: true,
      $limit: 0,
    },
  });

  if (campaignsForStore.total < ACTIVE_CAMPAIGNS_LIMIT) {
    return;
  }

  throw new BadRequest(
    `You can have up to ${ACTIVE_CAMPAIGNS_LIMIT} active campaigns at a time`,
  );
};

export const hooks = {
  before: {
    all: [],
    find: [requireAnyQueryParam(['forStore'])],
    get: [],
    create: [
      authenticate('jwt'),
      setCurrentUser(['forStore']),
      validate(sdk.campaign.validate),
      validateNumActiveCampaigns,
    ],
    patch: [
      authenticate('jwt'),
      queryWithCurrentUser(['forStore']),
      validate(sdk.campaign.validate),
      validateNumActiveCampaigns,
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
