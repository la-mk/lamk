import merge from 'lodash/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { validate, validateSingle } from '../utils/validation';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';
import { JSONSchemaType } from 'ajv';

export const schema: JSONSchemaType<Store> = {
  type: 'object',
  additionalProperties: false,
  required: [
    ...defaultSchemaEntries.required,
    'ownedBy',
    'name',
    'slug',
    'color',
  ],
  properties: {
    ...defaultSchemaEntries.properties!,
    ownedBy: {
      type: 'string',
      format: 'uuid',
    },
    name: {
      type: 'string',
      minLength: 2,
      maxLength: 511,
    },
    slug: {
      type: 'string',
      minLength: 4,
      maxLength: 511,
    },
    color: {
      type: 'string',
      format: 'hexColor',
      default: '#7859d1',
    },
    slogan: {
      nullable: true,
      type: 'string',
      minLength: 2,
      maxLength: 255,
    },
    customDomain: {
      nullable: true,
      type: 'string',
      minLength: 2,
      maxLength: 511,
    },
    company: {
      nullable: true,
      type: 'object',
      additionalProperties: false,
      required: [
        'companyName',
        'companyAddress',
        'registryNumber',
        'taxNumber',
      ],
      properties: {
        companyName: {
          type: 'string',
          minLength: 2,
          maxLength: 511,
        },
        companyAddress: {
          type: 'string',
          minLength: 2,
          maxLength: 1023,
        },
        registryNumber: {
          type: 'string',
          minLength: 2,
          maxLength: 127,
        },
        taxNumber: {
          type: 'string',
          minLength: 2,
          maxLength: 127,
        },
      },
    },
    contact: {
      nullable: true,
      type: 'object',
      additionalProperties: false,
      required: ['email', 'phoneNumber'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
        },
        phoneNumber: {
          type: 'string',
          minLength: 4,
          maxLength: 63,
        },
        alternatePhoneNumber: {
          nullable: true,
          type: 'string',
          minLength: 4,
          maxLength: 63,
        },
      },
    },
    logo: {
      nullable: true,
      type: 'string',
      minLength: 2,
      maxLength: 4095,
    },
    isPublished: {
      type: 'boolean',
    },
  },
};

export interface Store extends DefaultSchema {
  ownedBy: string;
  name: string;
  slug: string;
  color: string;
  slogan?: string;
  customDomain?: string;
  company?: {
    companyName: string;
    companyAddress: string;
    registryNumber: string;
    taxNumber: string;
  };
  contact?: {
    email: string;
    phoneNumber: string;
    alternatePhoneNumber?: string;
  };
  logo?: string;
  isPublished: boolean;
}

export const getStoreSdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<Store>, Store>(
    client,
    'stores'
  );
  return {
    ...crudMethods,

    findOwned: (userId: string, params?: Params) => {
      const options = {};
      merge(options, params, { query: { ownedBy: userId } });
      return crudMethods.find(options);
    },

    getBySlug: (slug: string, params?: Params) => {
      const options = {};
      merge(options, params, { query: { slug } });
      return crudMethods.find(options).then(resp => {
        if (resp.total <= 0) {
          return null;
        }

        if (resp.total > 1) {
          throw new Error('Ambiguous store slug provided.');
        }

        return resp.data[0] as Store;
      });
    },

    validate: (data: Store, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },
    schema,
  };
};
