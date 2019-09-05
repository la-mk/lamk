import { HookContext } from '@feathersjs/feathers';
import * as uuid from 'uuid/v4';

export const setIdFromUser = (context: HookContext) => {
  if (context.method === 'create') {
    const userEntity = context.params['user'];
    if (!userEntity) {
      throw new Error('You need to authenticate before using this hook.');
    }

    context.data._id = userEntity._id;
  }
};

export const appendId = (context: HookContext) => {
  if (context.method === 'create') {
    context.data._id = uuid();
  }
};
