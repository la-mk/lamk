import setup from '../../../server/server';
import { Application } from '@feathersjs/express';
import { UniqueConstraint, NotFound } from '../../../common/errors';
import { Service } from '@feathersjs/feathers';
import { User } from '@sradevski/la-sdk/dist/models/user';
import { Cart } from '@sradevski/la-sdk/dist/models/cart';
import fixtures from '../../../../tests/fixtures';

// const getToken = (feathersApp: Application) => {
//   return feathersApp.service('authentication').create({
//     strategy: 'local',
//     ...testUser,
//   });
// };

describe('"users" service', () => {
  let feathersApp: Application;
  let users: Service<User>;
  let carts: Service<Cart>;

  beforeAll(async () => {
    feathersApp = await setup();
    users = feathersApp.service('users');
    carts = feathersApp.service('carts');
  });

  it('creates a user', async () => {
    const [testUser] = await fixtures.user(
      feathersApp,
      1,
      {},
      { email: 'test@example.com' },
    );
    expect(testUser.email).toBe('test@example.com');
  });

  it('creates a cart when a new user is created with the same ID', async () => {
    const [testUser] = await fixtures.user(feathersApp, 1);
    const cartForUser = await carts.get(testUser._id);
    expect(cartForUser).toBeDefined();
  });

  it('removes a cart when a user is removed', async () => {
    expect.assertions(1);
    const [testUser] = await fixtures.user(feathersApp, 1);
    await users.remove(testUser._id);
    const cartForUserPromise = carts.get(testUser._id);

    await expect(cartForUserPromise).rejects.toThrow(NotFound);
  });

  it('ensures email is unique when creating a user', async () => {
    expect.assertions(1);
    await fixtures.user(feathersApp, 1, {}, { email: 'nonunique@test.com' });

    const promise = fixtures.user(
      feathersApp,
      1,
      {},
      { email: 'nonunique@test.com' },
    );
    await expect(promise).rejects.toThrow(UniqueConstraint);
  });

  it('ensures email is unique when patching a user', async () => {
    expect.assertions(1);
    const testUsers = await fixtures.user(feathersApp, 2, {});
    const promise = users.patch(testUsers[0]._id, {
      email: testUsers[1].email,
    });
    await expect(promise).rejects.toThrow(UniqueConstraint);
  });

  it('excludes the password from the returned results', async () => {
    const [testUser] = await fixtures.user(feathersApp, 1, {});

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
