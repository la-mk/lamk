// @ts-ignore
import * as feathers from '@feathersjs/client';
import { Application } from '@feathersjs/feathers';

export const setupClient = () => {
  const client: Application = feathers();
  return client;
};
