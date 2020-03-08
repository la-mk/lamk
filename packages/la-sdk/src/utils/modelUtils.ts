import isObject from 'lodash/isObject';
import { errors, getError } from './errors';

export interface SingleValidationErrorResponse {
  name: string;
  message: string;
  args?: any[];
}

export interface ValidationErrorResponse {
  [key: string]: SingleValidationErrorResponse;
}

export const getShortId = (
  idOrItem: string | { _id: string; [key: string]: any },
): string => {
  let id = idOrItem;
  if (isObject(idOrItem)) {
    id = idOrItem._id;
  }

  return id.substring(0, 8);
};

export const validateSingle = (schema: any, val: any, selector: string) => {
  const validator = schema[selector];
  if (!validator) {
    return errors['invalid-schema-selector'];
  }

  const validation = validator.testAll(val);
  if (validation.length > 0) {
    // If it is an optional field, see what the real cause for the error is
    if (validation[0].rule.name === 'optional') {
      return getError(
        validation[0].cause.rule.name,
        validation[0].cause.rule.args,
      );
    }

    return getError(validation[0].rule.name, validation[0].rule.args);
  }

  return null;
};

const checkMissingInSchema = (schema: any, data: any) =>
  Object.keys(data).reduce((errs: ValidationErrorResponse, entry) => {
    const existsInSchema = Boolean(schema[entry]);
    if (!existsInSchema) {
      errs[entry] = getError('missing-in-schema', [entry]);
    }

    return errs;
  }, {});

const checkDataAgainstSchema = (
  schema: any,
  data: any,
  ignoreRequired: boolean,
) =>
  Object.keys(schema).reduce((errs: ValidationErrorResponse, entry) => {
    const val = data[entry];
    if (ignoreRequired && (val === null || val === undefined)) {
      return errs;
    }

    const err = validateSingle(schema, val, entry);
    if (err) {
      errs[entry] = err;
    }

    return errs;
  }, {});

export const validate = (
  schema: any,
  data: any = {},
  ignoreRequired: boolean = false,
) => {
  const failedValidationErrors = checkDataAgainstSchema(
    schema,
    data,
    ignoreRequired,
  );

  const missingInSchemaErrors = checkMissingInSchema(schema, data);

  const allErrors = {
    ...missingInSchemaErrors,
    ...failedValidationErrors,
  };

  if (Object.keys(allErrors).length > 0) {
    return allErrors;
  }

  return null;
};
