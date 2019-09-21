import { HookContext } from '@feathersjs/feathers';
import * as uuid from 'uuid/v4';

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
