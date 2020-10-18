import { set, get, last } from 'lodash';
import { keywords, formats } from './customRules';
import Ajv, { JSONSchemaType, DefinedError } from 'ajv';
import addFormats from 'ajv-formats';
import { toArrayPath } from '../schema';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
keywords.forEach(keyword => ajv.addKeyword(keyword));
formats.forEach(format => ajv.addFormat(format.name, format.format));

export interface SingleValidationErrorResponse {
  name: DefinedError['keyword'];
  message: string;
  args?: DefinedError['params'];
}

export interface ValidationErrorResponse {
  [key: string]: SingleValidationErrorResponse | ValidationErrorResponse;
}

const filterRequired = (errors: DefinedError[]) =>
  errors.filter(error => error.keyword !== 'required');

const transformToErrorObject = (
  errors: DefinedError[]
): ValidationErrorResponse => {
  const res: ValidationErrorResponse = {};
  errors.forEach(err => {
    const args = err.params;

    let path = toArrayPath(err.dataPath);
    if ('missingProperty' in args) {
      path.push(args.missingProperty);
    } else if ('additionalProperty' in args) {
      path.push(args.additionalProperty);
    }

    let errName: string = err.keyword;
    if (err.keyword === 'type') {
      errName = err.params.type;
    }

    if (err.keyword === 'format') {
      errName = err.params.format;
    }

    set(res, path, {
      name: errName,
      message: err.message,
      args: { ...args, field: last(path) },
    });
  });

  return res;
};

export const validateSingle = <T extends any>(
  schema: JSONSchemaType<T>,
  val: any,
  selector: string
) => {
  const valAsObject: Partial<T> = set({}, selector, val);
  const errors = validate<T>(schema, valAsObject, true);
  if (!errors) {
    return null;
  }

  return get(errors, selector) as SingleValidationErrorResponse | null;
};

export const validate = <T extends any>(
  schema: JSONSchemaType<T>,
  data: T | Partial<T>,
  ignoreRequired: boolean = false
) => {
  const validate = ajv.compile(schema);
  const isValid = validate(data);
  if (isValid) {
    return null;
  }

  const errors = ignoreRequired
    ? filterRequired(validate.errors as DefinedError[])
    : (validate.errors as DefinedError[]);

  const res = transformToErrorObject(errors);
  if (Object.keys(res).length === 0) {
    return null;
  }

  return res;
};
