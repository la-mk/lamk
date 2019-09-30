import { HookContext } from '@feathersjs/feathers';

export const appendCreateTimestamp = (context: HookContext) => {
  if (context.method === 'create') {
    context.data.createdAt = new Date(Date.now()).toISOString();
  }
};

export const appendModifyTimestamp = (context: HookContext) => {
  if (context.method === 'patch' || context.method === 'update') {
    context.data.modifiedAt = new Date(Date.now()).toISOString();
  }
};
