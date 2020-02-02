import * as _ from 'lodash';
import { HookContext } from '@feathersjs/feathers';
import * as uuid from 'uuid/v4';
import { ValidationErrorResponse } from '@sradevski/la-sdk/dist/utils/modelUtils';
import { BadRequest } from '../errors';
import { checkContext } from 'feathers-hooks-common';

export const appendId = (context: HookContext) => {
  checkContext(context, null, 'create');
  context.data._id = uuid();
};

export const setFieldsFromOther = (pairs: Array<[string, string]>) => (
  context: HookContext,
) => {
  pairs.forEach(pair => {
    context.data[pair[0]] = context.data[pair[1]];
  });
};

export const setFields = (pairs: { [key: string]: any }) => (
  context: HookContext,
) => {
  Object.keys(pairs).forEach(key => {
    if (context.data[key]) {
      context.data[key] = pairs[key];
    }
  });
};

export const validate = (
  validator: (
    data: any,
    ignoreRequired?: boolean,
  ) => ValidationErrorResponse | null,
) => {
  return (context: HookContext) => {
    let ignoreRequired = false;
    if (context.method === 'patch') {
      ignoreRequired = true;
    }

    let data = context.data;
    // If the user tries to pull an object, no need to do any validation on it as the DB will validate
    if (data['$pull']) {
      data = _.omit(data, '$pull');
    }

    // TODO: Validating $set is complicated, skip it for now
    if (data['$set']) {
      data = _.omit(data, '$set');
    }

    if (data['$push']) {
      // Push contains a single object that will be added to an otherwise array field, so we need to convert it for proper validation.
      data = data['$push'];
      data = Object.keys(data).reduce((asArray: any, key) => {
        asArray[key] = [data[key]];
        return asArray;
      }, {});
    }

    const errors = validator(data, ignoreRequired);

    if (errors) {
      console.error(data, errors);
      throw new BadRequest('The passed data is invalid', errors);
    }
  };
};

const comparisonItemsSet = new Set(['$lt', '$lte', '$gt', '$gte', '$ne']);

const convertObjToNumber = (fields: Set<string>, obj: any) => {
  Object.keys(obj).forEach(key => {
    if (!fields.has(key)) {
      return;
    }

    if (_.isString(obj[key])) {
      obj[key] = _.toNumber(obj[key]);
      return;
    }

    convertObjToNumber(comparisonItemsSet, obj[key]);
  });
};

// TODO: There are many edge cases that this won't support, and it won't support nested filtering.
// The values are only stringified when using REST: https://docs.feathersjs.com/api/databases/querying.html#querying
// The method mutates the query object, if it exists
export const convertQueryToNumber = (fields: Set<string>) => {
  return (context: HookContext) => {
    const query = context.params.query ?? {};
    convertObjToNumber(fields, query);
  };
};
