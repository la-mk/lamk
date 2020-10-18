import merge from 'lodash/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';
import { JSONSchemaType } from 'ajv';
import { ProductSet } from './product';

export const schema: JSONSchemaType<StoreContents> = {
  type: 'object',
  additionalProperties: false,
  required: [...defaultSchemaEntries.required, 'forStore'],
  properties: {
    ...defaultSchemaEntries.properties!,
    forStore: {
      type: 'string',
      format: 'uuid',
    },
    aboutUs: {
      nullable: true,
      type: 'object',
      additionalProperties: false,
      required: [],
      properties: {
        description: {
          nullable: true,
          type: 'string',
          minLength: 2,
          maxLength: 65535,
        },
      },
    },
    landing: {
      nullable: true,
      type: 'object',
      additionalProperties: false,
      required: ['sets'],
      properties: {
        banner: {
          nullable: true,
          type: 'string',
          minLength: 2,
          maxLength: 4095,
        },
        sets: {
          type: 'array',
          maxItems: 12,
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['title', 'type', 'value', 'isPromoted'],
            properties: {
              title: {
                type: 'string',
                minLength: 2,
                maxLength: 511,
              },
              subtitle: {
                nullable: true,
                type: 'string',
                minLength: 2,
                maxLength: 511,
              },
              type: {
                type: 'string',
                enum: ['group', 'category'],
                minLength: 2,
                maxLength: 127,
              },
              value: {
                type: 'string',
                minLength: 2,
                maxLength: 255,
              },
              isPromoted: {
                type: 'boolean',
              },
            },
          },
        },

        hideSlogan: {
          nullable: true,
          type: 'boolean',
        },
      },
    },
  },
};

export interface StoreContents extends DefaultSchema {
  forStore: string;
  aboutUs?: {
    description: string;
  };
  landing?: {
    banner?: string;
    sets: ProductSet[];
    hideSlogan?: boolean;
  };
}

export const getStoreContentsSdk = (client: Application) => {
  const crudMethods = getCrudMethods<
    OmitServerProperties<StoreContents>,
    StoreContents
  >(client, 'storeContents');

  const findForStore = (storeId: string, params?: Params) => {
    const options = {};
    merge(options, params, { query: { forStore: storeId } });
    return crudMethods.find(options);
  };

  return {
    ...crudMethods,
    findForStore,
    getAboutUsForStore: (storeId: string, params?: Params) => {
      return findForStore(storeId, params).then(res =>
        res.total > 0 ? res.data[0].aboutUs : undefined
      );
    },

    getLandingContentForStore: (storeId: string, params?: Params) => {
      return findForStore(storeId, params).then(res =>
        res.total > 0 ? res.data[0].landing : undefined
      );
    },

    validate: (data: StoreContents, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },
    schema,
  };
};
