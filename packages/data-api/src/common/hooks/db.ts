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

    const errors = validator(context.data, ignoreRequired);

    if (errors) {
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
