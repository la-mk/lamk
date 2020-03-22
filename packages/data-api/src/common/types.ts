import { HookContext } from '@feathersjs/feathers';

export interface HookContextWithState<T> extends HookContext {
  contextState: T;
}
