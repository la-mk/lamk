import { User } from '@sradevski/la-sdk/dist/models/user';
import {v4 as uuid} from 'uuid';
import { defaultGenerator, GeneratorFunc } from './helpers';

const defaultFixture: Partial<User> = {
  email: 'addresses@fixture.com',
  password: 'supersecret',
  isEmailVerified: false,
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
