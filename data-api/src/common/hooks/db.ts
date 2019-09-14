import { HookContext } from '@feathersjs/feathers';
import * as uuid from 'uuid/v4';

export const appendId = (context: HookContext) => {
  if (context.method === 'create') {
    context.data._id = uuid();
  }
};
