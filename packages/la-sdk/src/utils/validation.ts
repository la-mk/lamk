import { property, uniq, uniqBy } from 'lodash';
import v8n from 'v8n';
import { errors, getError } from './errors';

export interface SingleValidationErrorResponse {
  name: string;
  message: string;
  args?: any[];
}

export interface ValidationErrorResponse {
  [key: string]: SingleValidationErrorResponse;
}

type Primitive = string | boolean | number;

const extendValidation = () => {
  v8n.extend({
    oneOf: (expected: Array<Primitive>) => (value: Primitive) =>
      expected.includes(value),
    // Regex source: https://github.com/sindresorhus/email-regex but no need to add it as another dependency
    email: () => (value: string) => {
      const regex =
        '[^\\.\\s@:](?:[^\\s@:]*[^\\s@:\\.])?@[^\\.\\s@]+(?:\\.[^\\.\\s@]+)*';
      const tester = new RegExp(`^${regex}$`);
      return tester.test(value);
    },
    unique: (propertyPath?: string) => (value: any[]) => {
      const unique = propertyPath
        ? uniqBy(value, property(propertyPath))
        : uniq(value);
      return value.length === unique.length;
    },
    // We check if the string is a valid ISO date
    datetime: () => (value: string) => {
      const parsed = Date.parse(value);
      if (isNaN(parsed)) {
        return false;
      }

      // We strictly check if the string date passed is in the ISO format toISOString returns.
      return value === new Date(parsed).toISOString();
    },
  });
};

extendValidation();

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
        validation[0].cause.rule.args
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
  ignoreRequired: boolean
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
  ignoreRequired: boolean = false
) => {
  const failedValidationErrors = checkDataAgainstSchema(
    schema,
    data,
    ignoreRequired
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
