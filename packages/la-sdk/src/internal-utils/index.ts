import { JSONSchemaType } from 'ajv';

export const defaultSchemaEntries: JSONSchemaType<DefaultSchema> = {
  type: 'object',
  additionalProperties: false,
  // All of these are created on the server and optional for the client.
  required: [],
  properties: {
    _id: {
      type: 'string',
      format: 'uuid'
    },
    createdAt: {
      type: 'string',
      format: 'date-time'
    },
    modifiedAt: {
      type: 'string',
      format: 'date-time'
    },
  }
};

export interface DefaultSchema {
  _id: string;
  createdAt: string;
  modifiedAt: string;
}
