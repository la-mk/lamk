import setup from '../../../server/server';
import { Application } from '@feathersjs/express';
import { UniqueConstraint, NotFound } from '../../../common/errors';
import { Service } from '@feathersjs/feathers';
import { User } from '@sradevski/la-sdk/dist/models/user';
import { Cart } from '@sradevski/la-sdk/dist/models/cart';

// const getToken = (feathersApp: Application) => {
//   return feathersApp.service('authentication').create({
//     strategy: 'local',
//     ...testUser,
//   });
// };

const testUserCredentials = {
  email: 'test@example.com',
  password: 'supersecret',
};

const testUser2Credentials = {
  email: 'test2@example.com',
  password: 'supersecret',
};

describe('"users" service', () => {
  let feathersApp: Application;
  let users: Service<User>;
  let carts: Service<Cart>;
  let testUser: User;
  let testUser2: User;

  beforeAll(async () => {
    feathersApp = await setup();
    users = feathersApp.service('users');
    carts = feathersApp.service('carts');
  });

  it('creates a user', async () => {
    testUser = await users.create(testUserCredentials);
    expect(testUser.email).toBe('test@example.com');
  });

  it('creates a cart when a new user is created with the same ID', async () => {
    testUser2 = await users.create(testUser2Credentials);
    const cartForUser = await carts.get(testUser2._id);
    expect(cartForUser).toBeDefined();
  });

  it('removes a cart when a user is removed', async () => {
    expect.assertions(1);
    const userId = testUser2._id;
    await users.remove(testUser2._id);
    const cartForUserPromise = carts.get(userId);

    await expect(cartForUserPromise).rejects.toThrow(NotFound);
  });

  it('ensures email is unique when creating a user', async () => {
    expect.assertions(1);
    const createUserPromise = users.create(testUserCredentials);
    await expect(createUserPromise).rejects.toThrow(UniqueConstraint);
  });

  it('ensures email is unique when patching a user', async () => {
    expect.assertions(1);
    const createUserPromise = users.patch(testUser._id, testUserCredentials);
    await expect(createUserPromise).rejects.toThrow(UniqueConstraint);
  });

  it('excludes the password from the returned results', async () => {
    // Setting `provider` indicates an external request
    const params = {
      provider: 'rest',
      authenticated: true,
      user: testUser,
    };

    const user = await users.get(testUser._id, params);
    expect(user.password).toBeUndefined();
  });
});
