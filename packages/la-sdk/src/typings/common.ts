import { JSONSchemaType } from 'ajv';

export type FixedJsonSchemaType<T> = Omit<JSONSchemaType<T>, 'type'> & {
  type: string | string[];
};
