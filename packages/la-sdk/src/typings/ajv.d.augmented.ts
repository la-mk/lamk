import * as ajv from 'ajv';
declare module 'ajv' {
  export type Known =
    | KnownRecord
    | [Known, ...Known[]]
    | Known[]
    | number
    | string
    | boolean
    | null;

  export interface KnownRecord extends Record<string, Known> {}
  export interface NumberKeywords {
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: number;
    exclusiveMaximum?: number;
    multipleOf?: number;
    format?: string;
  }
  export interface StringKeywords {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    format?: string;
  }
}
