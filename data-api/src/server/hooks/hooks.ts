import { registerOrdersHooks } from './orders';
import { registerAppHooks } from './app';

export const registerHooks = (app: any) => {
  registerAppHooks(app);
  registerOrdersHooks(app);
};
