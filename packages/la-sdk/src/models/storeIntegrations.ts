import merge from 'lodash/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';
import { JSONSchemaType } from 'ajv';

export const schema: JSONSchemaType<StoreIntegrations> = {
  type: 'object',
  additionalProperties: false,
  required: [...defaultSchemaEntries.required, 'forStore', 'services'],
  properties: {
    ...defaultSchemaEntries.properties!,
    forStore: {
      type: 'string',
      format: 'uuid',
    },
    services: {
      type: 'object',
      additionalProperties: false,
      required: [],
      properties: {
        facebookChat: {
          // @ts-ignore the typings are wrong
          type: ['object', 'null'],
          additionalProperties: false,
          required: ['pageId'],
          properties: {
            pageId: {
              type: 'string',
              maxLength: 63,
              minLength: 2,
            },
          },
        },
      },
    },
  },
};

export interface StoreIntegrations extends DefaultSchema {
  forStore: string;
  services: {
    facebookChat?: {
      pageId: string;
    };
  };
}

export const getStoreIntegrationsSdk = (client: Application) => {
  const crudMethods = getCrudMethods<
    OmitServerProperties<StoreIntegrations>,
    StoreIntegrations
  >(client, 'storeIntegrations');

  return {
    ...crudMethods,

    findForStore: (storeId: string, params?: Params) => {
      const options = {};
      merge(options, params, { query: { forStore: storeId } });
      return crudMethods.find(options);
    },

    validate: (data: StoreIntegrations, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },

    schema,
  };
};
