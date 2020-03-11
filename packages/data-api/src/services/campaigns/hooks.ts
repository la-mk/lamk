import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import { requireAnyQueryParam } from '../../common/hooks/filtering';
import { sdk } from '@sradevski/la-sdk';
import { validate } from '../../common/hooks/db';
import {
  setCurrentUser,
  queryWithCurrentUser,
  allowFields,
  setNonOwnerQuery,
} from '../../common/hooks/auth';
import { HookContext } from '@feathersjs/feathers';
import { checkContext, alterItems } from 'feathers-hooks-common';
import { BadRequest } from '../../common/errors';

const allowedFields = [
  '_id',
  'forStore',
  'name',
  'isPromoted',
  'type',
  'reward',
  'productRules',
];

const ACTIVE_CAMPAIGNS_LIMIT = 10;
const PROMOTED_CAMPAIGNS_LIMIT = 1;

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

const validateNumPromotedCampaigns = async (ctx: HookContext) => {
  checkContext(ctx, 'before', ['create', 'patch']);
  const campaign = ctx.data;
  // If there was no change to isPromoted, or is false, we don't need to check.
  if (!campaign.isPromoted) {
    return;
  }

  // This won't be correct on concurrent requests, but it's not a big deal.
  const campaignsForStore = await ctx.app.services['campaigns'].find({
    query: {
      forStore: campaign.forStore ?? ctx.params.query?.forStore,
      isPromoted: true,
      $limit: 0,
    },
  });

  if (campaignsForStore.total < PROMOTED_CAMPAIGNS_LIMIT) {
    return;
  }

  throw new BadRequest(
    `You can have up to ${PROMOTED_CAMPAIGNS_LIMIT} promoted campaigns at a time`,
  );
};

// TODO: We should be able to do dependent validations in the SDK but it is currently not supported.
const validateReward = async (ctx: HookContext) => {
  checkContext(ctx, 'before', ['create', 'patch']);
  const { reward } = ctx.data;
  // The reward wasn't updated
  if (!reward) {
    return;
  }

  if (
    reward.type === sdk.campaign.RewardTypes.PERCENTAGE_DISCOUNT &&
    reward.value > 100
  ) {
    throw new BadRequest(
      'The reward discount percentage has to be between 0 and 100',
    );
  }
};

export const hooks = {
  before: {
    all: [],
    find: [
      setNonOwnerQuery(['forStore'], { isActive: true }),
      requireAnyQueryParam(['forStore']),
    ],
    get: [],
    create: [
      authenticate('jwt'),
      setCurrentUser(['forStore']),
      // These are the only ones we support as of now, we just alter them to avoid potential validation errors.
      alterItems(record => {
        record.type = sdk.campaign.CampaignTypes.CART_DISCOUNT;
        record.productRules = [
          { type: sdk.campaign.ProductRuleTypes.ALL, value: 'all' },
        ];
      }),
      validate(sdk.campaign.validate),
      validateReward,
      validateNumPromotedCampaigns,
      validateNumActiveCampaigns,
    ],
    patch: [
      authenticate('jwt'),
      queryWithCurrentUser(['forStore']),
      alterItems(record => {
        record.type = sdk.campaign.CampaignTypes.CART_DISCOUNT;
        record.productRules = [
          { type: sdk.campaign.ProductRuleTypes.ALL, value: 'all' },
        ];
      }),
      validate(sdk.campaign.validate),
      validateReward,
      validateNumPromotedCampaigns,
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
