import { disallow, checkContext } from 'feathers-hooks-common';
import { requireAllQueryParams } from '../../common/hooks/filtering';
import { HookContext } from '@feathersjs/feathers';
import { convertQueryToNumber } from '../../common/hooks/db';

// Mutates the passed items array
const sortAsOther = (items: Array<{ _id: string }>, as: string[]) => {
  const asMap = as.reduce((asMap: { [id: string]: number }, x, index) => {
    asMap[x] = index;
    return asMap;
  }, {});

  // Sort based on the index in the `as` array, set to the largest if not in map
  items.sort(
    (a, b) => (asMap[a._id] ?? as.length) - (asMap[b._id] ?? as.length),
  );
};

const convertFindToStandardResponse = async (ctx: HookContext) => {
  checkContext(ctx, 'after', ['find']);
  const { result, params } = ctx;
  const total = result.found;
  const itemIds = result.hits.map((hit: any) => hit.document.id);
  const items = await ctx.app.services[params.query?.model].find({
    query: { _id: { $in: itemIds } },
  });

  // The current search engine only allows up to 500 results.
  items.total = total > 500 ? 500 : total;
  sortAsOther(items.data, itemIds);
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

const numberFieldsSet = new Set(['calculatedPrice', '$limit', '$skip']);

export const hooks = {
  before: {
    all: [],
    find: [
      requireAllQueryParams(['model', 'search', 'storeId', '$limit', '$skip']),
      convertQueryToNumber(numberFieldsSet),
    ],
    get: [requireAllQueryParams(['model'])],
    create: [disallow('external')],
    patch: [disallow('external')],
    remove: [disallow('external'), requireAllQueryParams(['model'])],
  },

  after: {
    all: [],
    find: [convertFindToStandardResponse],
    get: [convertGetToStandardResponse],
    create: [],
    patch: [],
    remove: [],
  },
};
