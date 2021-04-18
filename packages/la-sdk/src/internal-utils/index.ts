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

// @ts-ignore the typings are wrong
export const mediaSchema: JSONSchemaType<Media> = {
  // @ts-ignore the typings are wrong
  type: ['object', 'null'],
  additionalProperties: false,
  required: ['_id', 'height', 'width', 'size', 'mimeType'],
  properties: {
    // TODO: Currently we append the image format to the _id, so it is not just a plain UUID. We can probably remove that.
    _id: {
      type: 'string',
    },
    height: {
      type: 'number',
      exclusiveMinimum: 0,
    },
    width: {
      type: 'number',
      exclusiveMinimum: 0,
    },
    // In bytes
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

export interface Media {
  _id: string;
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
