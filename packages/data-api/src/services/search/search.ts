import { Application, Service, Params } from '@feathersjs/feathers';
// @ts-ignore
import * as Typesense from 'typesense';
import { hooks } from './hooks';
import { productsModel } from './searchModels';
import env from '../../common/env';
import { logger } from '../../common/logger';
import { GeneralError, BadRequest } from '../../common/errors';
import { Product } from '@sradevski/la-sdk/dist/models/product';

const getModel = (model: string) => {
  switch (model) {
    case 'products': {
      return productsModel;
    }
  }

  throw new BadRequest('The requested search model does not exist');
};

// The actual data sengrid accepts is much larger than this, but this should do for now.
export interface SearchServiceData {
  model: 'products';
  data: Product;
}

class SearchService implements Service<SearchServiceData> {
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
    // TODO: Support filtering and sorting
    const { model, search, $skip, $limit /*...rest*/ } = params.query;

    const searchParameters = {
      q: getModel(model).transformSearchQuery(search),
      // Page starts from
      page: $skip + 1,
      // eslint-disable-next-line
      per_page: $limit,
      // eslint-disable-next-line
      query_by: getModel(model).searchFields.join(','),
      // filter_by: 'num_employees:>100',
      // sort_by: 'num_employees:desc',
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
      if (err.message.includes(404)) {
        return {};
      }

      logger.error('Failed to get document in search', err.message);
      throw new GeneralError('Failed to get document in search', id);
    }
  }

  // @ts-ignore
  async create(entry: SearchServiceData) {
    const transformedData = getModel(entry.model).transform(entry.data);
    console.log(transformedData);

    try {
      console.log(
        await this.engineClient
          .collections(entry.model)
          .documents()
          .create(transformedData),
      );

      return;
    } catch (err) {
      // The collection doesn't exist, so we lazily create it first.
      if (err.message.includes(404)) {
        try {
          await this.engineClient
            .collections()
            .create(getModel(entry.model).schema);

          // We retry to create the document. We shouldn't enter in a loop, as this will only run if the collection was successfully created.
          this.create(entry);
        } catch (err) {
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
  async patch(id: string, entry: SearchServiceData) {
    try {
      // The search engine doesn't support updates, so we remove and then add the entry.
      await this.remove(id, { query: { model: entry.model } });
      await this.create(entry);
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
      if (err.message.includes(404)) {
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
  const client = new Typesense.Client({
    masterNode: {
      host: env.SEARCH_SERVICE_ENDPOINT,
      port: env.NODE_ENV === 'development' ? '80' : '443',
      protocol: env.NODE_ENV === 'development' ? 'http' : 'https',
      apiKey: env.SEARCH_SERVICE_API_KEY,
    },

    timeoutSeconds: 10,
  });

  app.use('/search', new SearchService({ engineClient: client }));
  const service = app.service('search');
  service.hooks(hooks);
};
