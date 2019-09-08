import { HookContext } from '@feathersjs/feathers';
import { UniqueConstraint } from '../errors';

export const unique = (keys: string[]) => {
  return async (context: HookContext) => {
    const data = context.data;
    const queryArray = keys
      .filter(key => data && data[key])
      .map(key => ({ [key]: data[key] }));

    if (queryArray.length > 0) {
      const results = await context.service.find({
        query: {
          $or: queryArray,
        },
      });

      if (results.total > 0) {
        throw new UniqueConstraint(`${keys.join(', ')} need to be unique`);
      }
    }
  };
};
