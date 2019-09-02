import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';
import io from 'socket.io-client';
import { Application, Params, Id, NullableId } from '@feathersjs/feathers';

export interface FindResult<T> {
  total: number;
  limit: number;
  skip: number;
  data: T[];
}

export const setupClient = () => {
  const client: Application = feathers();

  const socket = io('http://localhost:3030');
  client.configure(socketio(socket));
  client.configure(
    authentication({
      storageKey: 'lamk-token',
    }),
  );
  return client;
};

export function getCrudMethods<T, U>(client: Application, serviceName: string) {
  return {
    find: (params?: Params) =>
      client.service(serviceName).find(params) as Promise<FindResult<U>>,
    get: (id: Id, params?: Params) =>
      client.service(serviceName).get(id, params) as Promise<U | null>,
    create: (data: T, params?: Params) =>
      client.service(serviceName).create(data, params) as Promise<U>,
    update: (id: NullableId, data: T, params?: Params) =>
      client.service(serviceName).update(id, data, params) as Promise<U>,
    patch: (id: NullableId, data: Partial<T>, params?: Params) =>
      client.service(serviceName).patch(id, data, params) as Promise<U>,
    remove: (id: NullableId, params?: Params) =>
      client.service(serviceName).remove(id, params) as Promise<U>,
  };
}
