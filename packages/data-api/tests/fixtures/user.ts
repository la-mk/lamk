import { User } from '@sradevski/la-sdk/dist/models/user';
import uuid from 'uuid/v4';
import { defaultGenerator, GeneratorFunc } from './helpers';

const defaultFixture: Partial<User> = {
  email: 'addresses@fixture.com',
  password: 'supersecret',
};

export default {
  generator: (...args) =>
    defaultGenerator<User>(
      {
        modelName: 'users',
        defaultFixture,
        uniqueData: () => ({ email: `${uuid()}@email.com` }),
      },
      ...args,
    ),
} as { generator: GeneratorFunc<User> };
