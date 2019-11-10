import isObject from 'lodash/isObject';

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
    return 'Invalid data passed.';
  }

  const validation = validator.testAll(val);
  if(validation.length > 0){
    return validation[0].rule.name;
  }

  return null;
}

export const validate = (schema: any, data: any = {}, ignoreRequired: boolean) => {
  const errorObj = Object.keys(schema).reduce((errs: any, entry) => {
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