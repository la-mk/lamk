import isObject from 'lodash/isObject';
import {errors} from './errors';

export interface SingleValidationErrorResponse {
  name: string;
  message: string;
}

export interface ValidationErrorResponse {
  [key: string] : SingleValidationErrorResponse;
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
  if(!validator) {
    return errors['invalid-schema-selector'];
  }

  const validation = validator.testAll(val);
  if(validation.length > 0){
    return errors[validation[0].rule.name] || errors['generic'];
  }

  return null;
}

export const validate = (schema: any, data: any = {}, ignoreRequired: boolean) => {
  const errorObj = Object.keys(schema).reduce((errs: ValidationErrorResponse, entry) => {
    const val = data[entry];
    if(ignoreRequired && (val === null || val === undefined)){
      return errs;
    }

    const err = validateSingle(schema, val, entry);
    if(err){
      errs[entry] = err
    }

    return errs;
  }, {});

  if(Object.keys(errorObj).length > 0){
    return errorObj;
  }

  return null;
};