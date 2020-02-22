import { disallow, checkContext } from 'feathers-hooks-common';
import {
  requireAnyQueryParam,
  requireAllQueryParams,
} from '../../common/hooks/filtering';
import { HookContext } from '@feathersjs/feathers';
import { convertQueryToNumber } from '../../common/hooks/db';

const convertFindToStandardResponse = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['find']);
  const { result, params } = ctx;
  const total = result.found;
  const itemIds = result.hits.map((hit: any) => hit.document.id);
  const items = await ctx.app.services[params.query?.model].find({
    query: { _id: { $in: itemIds }, $sort: params.query?.$sort ?? {} },
  });

  // The current search engine only allows up to 500 results.
  items.total = total > 500 ? 500 : total;
  // eslint-disable-next-line
  ctx.result = items;
};

const convertGetToStandardResponse = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['get']);
  const { result, params } = ctx;
  const item = await ctx.app.services[params.query?.model].get(result.id);
  // eslint-disable-next-line
  ctx.result = item;
};

const numberFieldsSet = new Set(['price']);

export const hooks = {
  before: {
    all: [],
    find: [
      requireAllQueryParams(['model', 'search', 'storeId', '$limit', '$skip']),
      convertQueryToNumber(numberFieldsSet),
    ],
    get: [requireAnyQueryParam(['model'])],
    create: [disallow('external')],
    patch: [disallow('external')],
    remove: [disallow('external'), requireAnyQueryParam(['model'])],
  },

  after: {
    all: [],
    find: [convertFindToStandardResponse],
    get: [convertGetToStandardResponse],
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
