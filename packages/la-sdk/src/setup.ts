import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import rest from '@feathersjs/rest-client';
import authentication from '@feathersjs/authentication-client';
import io from 'socket.io-client';
import { Application, Params, Id, NullableId } from '@feathersjs/feathers';

export interface FindResult<T> {
  total: number;
  limit: number;
  skip: number;
  data: T[];
}

export interface SetupSdkOptions {
  transport?: 'rest' | 'socket';
  host?: string;
  port?: number;
}

export const setupClient = (options: SetupSdkOptions) => {
  const client: Application = feathers();
  const host = `http://api.${options.host}:${options.port}`;

  if (options.transport && options.transport === 'rest') {
    if (typeof window === 'undefined') {
      // eslint-disable-next-line
      const fetch = require('node-fetch');
      client.configure(rest(host).fetch(fetch));
    } else {
      client.configure(rest(host).fetch(window.fetch));
    }
  } else {
    const socket = io(host, {
      // This is needed if there is a cluster of services running, check https://docs.feathersjs.com/cookbook/general/scaling.html#cluster-configuration.
      // transports: ['websocket'],
      // upgrade: false,
    });
    client.configure(socketio(socket));
  }

  client.configure(
    authentication({
      storageKey: 'lamk-token',
    }),
  );

  return client;
};

type PatchData<T> = Partial<T> | any;

export function getCrudMethods<T, U>(client: Application, serviceName: string) {
  return {
    find: (params?: Params) =>
      client.service(serviceName).find(params) as Promise<FindResult<U>>,
    get: (id: Id, params?: Params) =>
      client.service(serviceName).get(id, params) as Promise<U | null>,
    create: (data: T, params?: Params) =>
      client.service(serviceName).create(data, params) as Promise<U>,
    patch: (id: NullableId, data: PatchData<T>, params?: Params) =>
      client.service(serviceName).patch(id, data, params) as Promise<U>,
    remove: (id: NullableId, params?: Params) =>
      client.service(serviceName).remove(id, params) as Promise<U>,
  };
}
