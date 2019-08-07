// @ts-ignore
import * as feathers from '@feathersjs/client';
import io from 'socket.io-client';
import { Application, Params, Id, NullableId } from '@feathersjs/feathers';

export const setupClient = () => {
  const client: Application = feathers();

  const socket = io('http://localhost:3030');
  client.configure(feathers.socketio(socket));
  return client;
};

export const getCrudMethods = (client: Application, serviceName: string) => {
  return {
    find: (params?: Params) => client.service(serviceName).find(params),
    get: (id: Id, params?: Params) =>
      client.service(serviceName).get(id, params),
    create: (data: Partial<any>, params?: Params) =>
      client.service(serviceName).create(data, params),
    update: (id: NullableId, data: Partial<any>, params?: Params) =>
      client.service(serviceName).update(id, data, params),
    patch: (id: NullableId, data: Partial<any>, params?: Params) =>
      client.service(serviceName).patch(id, data, params),
    remove: (id: NullableId, params?: Params) =>
      client.service(serviceName).remove(id, params),
  };
};
