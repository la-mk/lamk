import { HookContext } from '@feathersjs/feathers';
import { ObjectID } from 'mongodb';

// See https://github.com/feathersjs/feathers/issues/757 why this is necessary
export const convertQueryObjectId = (context: HookContext) => {
  const { query = {} } = context.params;

  if (query._id) {
    if (typeof query._id === 'string') {
      query._id = new ObjectID(query._id);
    } else if (query._id.$in) {
      query._id.$in = query._id.$in.map((id: string) => new ObjectID(id));
    }
  }
};

export const setObjectIdFromUser = (context: HookContext) => {
  if (context.method === 'create') {
    const data = context.data;
    const userEntity = context.params['user'];
    if (!userEntity) {
      throw new Error('You need to authenticate before using this hook.');
    }

    data._id = new ObjectID(userEntity._id);
  }
};
