import merge from 'lodash/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';
import { JSONSchemaType } from 'ajv';

export const schema: JSONSchemaType<Integrations> = {
  type: 'object',
  additionalProperties: false,
  required: [...defaultSchemaEntries.required, 'forStore'],
  properties: {
    ...defaultSchemaEntries.properties!,
    forStore: {
      type: 'string',
      format: 'uuid',
    },
    facebookChat: {
      type: ['object', 'null'],
      additionalProperties: false,
      required: ['pageId'],
      properties: {
        pageId: {
          type: 'string',
          maxLength: 63,
          minlength: 2,
        },
      },
    },
  },
};

export interface Integrations extends DefaultSchema {
  forStore: string;
  facebookChat?: {
    pageId: string;
  };
}

export const getIntegrationsSdk = (client: Application) => {
  const crudMethods = getCrudMethods<
    OmitServerProperties<Integrations>,
    Integrations
  >(client, 'integrations');

  return {
    ...crudMethods,

    findForStore: (storeId: string, params?: Params) => {
      const options = {};
      merge(options, params, { query: { forStore: storeId } });
      return crudMethods.find(options);
    },

    validate: (data: Integrations, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },

    schema,
  };
};
