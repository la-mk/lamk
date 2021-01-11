import { JSONSchemaType } from 'ajv';

export const defaultSchemaEntries: JSONSchemaType<DefaultSchema> = {
  type: 'object',
  additionalProperties: false,
  // All of these are created on the server and optional for the client.
  required: [],
  properties: {
    _id: {
      type: 'string',
      format: 'uuid',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
    },
    modifiedAt: {
      type: 'string',
      format: 'date-time',
    },
  },
};

export const mediaSchema: JSONSchemaType<Media> = {
  type: 'object',
  additionalProperties: false,
  required: [
    ...defaultSchemaEntries.required,
    'height',
    'width',
    'size',
    'mimeType',
  ],
  properties: {
    ...defaultSchemaEntries.properties!,
    height: {
      type: 'number',
      exclusiveMinimum: 0,
    },
    width: {
      type: 'number',
      exclusiveMinimum: 0,
    },
    // In kb
    size: {
      type: 'number',
      exclusiveMinimum: 0,
    },
    mimeType: {
      type: 'string',
      enum: ['image/jpeg', 'image/png'],
    },
  },
};

export interface Media extends DefaultSchema {
  height: number;
  width: number;
  size: number;
  mimeType: 'image/jpeg' | 'image/png';
}

export interface DefaultSchema {
  _id: string;
  createdAt: string;
  modifiedAt: string;
}
