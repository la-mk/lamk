import * as _ from 'lodash';
import { Application, Service, Params } from '@feathersjs/feathers';
// @ts-ignore
import {Client as TypesenseClient} from 'typesense';
import { hooks } from './hooks';
import { productsModel } from './searchModels';
import env from '../../common/env';
import { logger } from '../../common/logger';
import { GeneralError, BadRequest } from '../../common/errors';

interface SearchData {
  model: string;
  item: any;
}

const getModel = (model: string) => {
  switch (model) {
    case 'products': {
      return productsModel;
    }
  }

  throw new BadRequest('The requested search model does not exist');
};

// These are the only supported operators for searching as of now.
const getSearchEngineFilters = (filters: any) => {
  return Object.keys(filters || {})
    .flatMap(key => {
      const value = filters[key];

      if (!_.isObject(value)) {
        return `${key}:${value}`;
      }

      if ((value as any).$in) {
        return `${key}:[${(value as any).$in}]`;
      }

      if ((value as any).$gte && (value as any).$lte) {
        return [
          `${key}:>=${(value as any).$gte}`,
          `${key}:<=${(value as any).$lte}`,
        ];
      }

      if ((value as any).$gte) {
        return `${key}:>=${(value as any).$gte}`;
      }

      if ((value as any).$lte) {
        return `${key}:<=${(value as any).$lte}`;
      }
    })
    .join(' && ');
};

class SearchService implements Service<SearchData> {
  engineClient: any;
  constructor(options: { engineClient: any }) {
    if (!options || !options.engineClient) {
      throw new Error(
        'Search service: `options.engineClient` must be provided',
      );
    }

    this.engineClient = options.engineClient;
  }

  // @ts-ignore
  async find(params: Params<any>) {
    const {
      model,
      search,
      storeId,
      $skip,
      $limit,
      $sort,
      ...rest
    } = params.query;

    const sort = _.first(
      Object.keys($sort || {}).map(
        key => `${key}:${$sort[key].toString() === '-1' ? 'desc' : 'asc'}`,
      ),
    );

    const filters = getSearchEngineFilters({
      [getModel(model).storeIdField]: storeId,
      ...rest,
    });

    const searchParameters = {
      q: getModel(model).transformSearchQuery(search),
      // Page starts from 1
      page: $skip / $limit + 1,
      // eslint-disable-next-line
      per_page: $limit,
      // eslint-disable-next-line
      query_by: getModel(model).searchFields.join(','),
      // eslint-disable-next-line
      filter_by: filters,
      // eslint-disable-next-line
      sort_by: sort,
      // Can be between 0 and 2
      // eslint-disable-next-line
      num_typos: 1,
    };

    try {
      return await this.engineClient
        .collections(model)
        .documents()
        .search(searchParameters);
    } catch (err) {
      logger.error('Failed to find documents in search', err.message);
      throw new GeneralError(
        'Failed to find documents in search',
        searchParameters,
      );
    }
  }

  // @ts-ignore
  async get(id: string, params: Params<any>) {
    const { model } = params.query;

    try {
      return await this.engineClient
        .collections(model)
        .documents(id)
        .retrieve();
    } catch (err) {
      if (err.message.toLowerCase().includes('not found')) {
        return {};
      }

      logger.error('Failed to get document in search', err.message);
      throw new GeneralError('Failed to get document in search', id);
    }
  }

  // @ts-ignore
  async create(entry: SearchData, params: Params) {
    const { model, item } = entry;
    if (!model) {
      throw new BadRequest('model is required when creating a search entry');
    }

    const transformedData = getModel(model).transform(item);

    try {
      await this.engineClient
        .collections(model)
        .documents()
        .create(transformedData);

      return transformedData;
    } catch (err) {
      // The product already exists, so we just want to return.
      if (err.message.toLowerCase().includes('already exists')) {
        return transformedData;
      }

      // The collection doesn't exist, so we lazily create it first.
      if (err.message.toLowerCase().includes('not found')) {
        try {
          await this.engineClient.collections().create(getModel(model).schema);

          // We retry to create the document. We shouldn't enter in a loop, as this will only run if the collection was successfully created.
          this.create(entry, params);
        } catch (err) {
          // A concurrent process might have already created the collection, so just try again and create the search entry.
          if (err.message.toLowerCase().includes('already exists')) {
            this.create(entry, params);
          }

          if (err instanceof GeneralError) {
            throw err;
          }

          logger.error('Failed to create collection:', err.message);
          throw new GeneralError('Failed to create collection', entry.model);
        }
      }

      logger.error('Failed to add document to search collection:', err.message);
      throw new GeneralError('Failed to add search document', transformedData);
    }
  }

  // @ts-ignore
  async patch(id: string, entry: SearchData, params: Params) {
    try {
      // The search engine doesn't support updates, so we remove and then add the entry.
      await this.remove(id, { query: { model: entry.model } });
      return await this.create(entry, params);
    } catch (err) {
      logger.error(
        'Failed to patch document to search collection:',
        err.message,
      );
      throw new GeneralError('Failed to patch search document', id);
    }
  }

  // @ts-ignore
  async remove(id: string, params: Params<any>) {
    const { model } = params.query;

    try {
      await this.engineClient
        .collections(model)
        .documents(id)
        .delete();

      return id;
    } catch (err) {
      // If the element we try to remove is not there, just log for documentation purposes and safely return. Unfortunately the error only has a message, so we rely on that.
      if (err.message.toLowerCase().includes('not found')) {
        logger.error(
          'Failed to remove document from search collection because it was not found',
          id,
        );

        return id;
      }

      logger.error(
        'Failed to remove document from search collection:',
        err.message,
      );
      throw new GeneralError('Failed to remove search document', id);
    }
  }
}

export const search = (app: Application) => {
  const client = new TypesenseClient({
    nodes: [
      {
        host: env().SEARCH_SERVICE_ENDPOINT,
        port: '443',
        protocol: 'https',
      },
    ],
    apiKey: env().SEARCH_SERVICE_API_KEY,
    connectionTimeoutSeconds: 5,
  });

  app.use('/search', new SearchService({ engineClient: client }));
  const service = app.service('search');
  service.hooks(hooks);
};
