import setup from '../../../server/server';
import { Application } from '@feathersjs/express';
import {
  UniqueConstraint,
  NotFound,
  NotAuthenticated,
} from '../../../common/errors';
import { Service } from '@feathersjs/feathers';
import { User } from '@sradevski/la-sdk/dist/models/user';
import { Cart } from '@sradevski/la-sdk/dist/models/cart';
import fixtures from '../../../../tests/fixtures';
import { AuthManagement } from '@sradevski/la-sdk/dist/models/authManagement';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { getExternalUserParams } from '../../../../tests/utils';

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
  let authManagement: Service<AuthManagement>;

  beforeAll(async () => {
    feathersApp = await setup();
    users = feathersApp.service('users');
    carts = feathersApp.service('carts');
    authManagement = feathersApp.service('authManagement');
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

  it('creates authManagement when a new user is created', async () => {
    const [testUser] = await fixtures.user(feathersApp, 1);
    const authManagementForUser = (await authManagement.find({
      query: { email: testUser.email },
    })) as FindResult<AuthManagement>;

    expect(authManagementForUser.data[0].email).toBe(testUser.email);
  });

  it('removes authManagement when a user is removed', async () => {
    expect.assertions(1);
    const [testUser] = await fixtures.user(feathersApp, 1);
    await users.remove(testUser._id);
    const authManagementForUser = (await authManagement.find({
      query: { email: testUser.email },
    })) as FindResult<AuthManagement>;

    expect(authManagementForUser.total).toBe(0);
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
    const params = getExternalUserParams(testUser);

    const user = await users.get(testUser._id, params);
    expect(user.password).toBeUndefined();
  });

  it('user cannot be patched if reset token and email are not passed and is unauthenticated', async () => {
    const [testUser] = await fixtures.user(feathersApp, 1, {});
    const patchEmailPromise = users.patch(
      null,
      { firstName: 'cannot' },
      {
        query: { email: testUser.email },
        provider: 'rest',
      },
    );

    const patchTokenPromise = users.patch(
      null,
      { firstName: 'cannot' },
      {
        query: { resetToken: '12345' },
        provider: 'rest',
      },
    );

    await expect(patchEmailPromise).rejects.toThrow(NotAuthenticated);
    await expect(patchTokenPromise).rejects.toThrow(NotAuthenticated);
  });

  it('user cannot be patched if reset token does not match', async () => {
    const [testUser] = await fixtures.user(feathersApp, 1, {});

    await authManagement.patch(
      null,
      {
        resetToken: '!',
      },
      { query: { email: testUser.email }, provider: 'rest' },
    );

    const userPromise = users.patch(
      null,
      { firstName: 'token' },
      {
        query: { email: testUser.email, resetToken: '1234567' },
        provider: 'rest',
      },
    );

    await expect(userPromise).rejects.toThrow(NotAuthenticated);
  });

  it('user cannot be patched if reset token was not requested', async () => {
    const [testUser] = await fixtures.user(feathersApp, 1, {});

    const res = (await authManagement.find({
      email: testUser.email,
    })) as FindResult<AuthManagement>;

    const userPromise = users.patch(
      null,
      { firstName: 'token' },
      {
        query: { email: res.data[0].email, resetToken: res.data[0].resetToken },
        provider: 'rest',
      },
    );

    await expect(userPromise).rejects.toThrow(NotAuthenticated);
  });

  it('user can be patched using a reset token', async () => {
    const [testUser] = await fixtures.user(feathersApp, 1, {});
    // We can get back the token since it's a server request.
    const [res] = await authManagement.patch(
      null,
      {
        resetToken: '!',
      },
      { query: { email: testUser.email } },
    );

    const [user] = await users.patch(
      null,
      { firstName: 'token' },
      {
        query: { email: res.email, resetToken: res.resetToken },
        provider: 'rest',
      },
    );

    expect(user.firstName).toBe('token');
  });
});
