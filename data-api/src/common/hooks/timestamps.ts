import { HookContext } from '@feathersjs/feathers';

export const appendCreateTimestamp = (context: HookContext) => {
  context.data.createdAt = new Date(Date.now()).toISOString();
};

export const appendModifyTimestamp = (context: HookContext) => {
  context.data.modifiedAt = new Date(Date.now()).toISOString();
};
