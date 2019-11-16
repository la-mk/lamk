import { HookContext } from '@feathersjs/feathers';
import * as uuid from 'uuid/v4';
import { ValidationErrorResponse } from '@lamk/la-sdk/dist/utils/modelUtils';
import { BadRequest } from '../errors';

export const appendId = (context: HookContext) => {
  if (context.method === 'create') {
    context.data._id = uuid();
  }
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
