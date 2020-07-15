import setup from '../../../server/server';
import { Application } from '@feathersjs/express';
import { MethodNotAllowed, BadRequest } from '../../../common/errors';
import { Service } from '@feathersjs/feathers';
import { User } from '@sradevski/la-sdk/dist/models/user';
import fixtures from '../../../../tests/fixtures';
import { AuthManagement } from '@sradevski/la-sdk/dist/models/authManagement';
import { getExternalUserParams } from '../../../../tests/utils';
import { FindResult } from '@sradevski/la-sdk/dist/setup';

describe('"authManagement" service', () => {
  let feathersApp: Application;
  let authManagement: Service<AuthManagement>;
  let testUsers: User[];

  beforeAll(async () => {
    feathersApp = await setup();
    authManagement = feathersApp.service('authManagement');
    testUsers = await fixtures.user(feathersApp, 2);
  });

  it('find, get, create and remove are disallowed for external calls', async () => {
    const params = getExternalUserParams(testUsers[0]);

    const findPromise = authManagement.find({
      query: {
        email: testUsers[0].email,
      },
      ...params,
    });

    const getPromise = authManagement.get('12345', params);

    const createPromise = authManagement.create(
      {
        email: testUsers[0].email,
      },
      params,
    );

    const removePromise = authManagement.remove('12345', params);

    await expect(findPromise).rejects.toThrow(MethodNotAllowed);
    await expect(getPromise).rejects.toThrow(MethodNotAllowed);
    await expect(createPromise).rejects.toThrow(MethodNotAllowed);
    await expect(removePromise).rejects.toThrow(MethodNotAllowed);
  });

  it('patch returns an empty object for external calls', async () => {
    const params = getExternalUserParams(testUsers[0]);

    const res = await authManagement.patch(
      null,
      {
        resetToken: '@',
      },
      { query: { email: testUsers[0].email }, ...params },
    );

    expect(res).toStrictEqual([{}]);
  });

  it('patch requires filtering by email', async () => {
    const params = getExternalUserParams(testUsers[0]);

    const resPromise = authManagement.patch(
      null,
      {
        resetToken: '@',
      },
      params,
    );

    await expect(resPromise).rejects.toThrow(BadRequest);
  });

  it('patching resetToken creates a random token in DB, regarldess of what user sent', async () => {
    const params = getExternalUserParams(testUsers[0]);

    await authManagement.patch(
      null,
      {
        resetToken: '@',
      },
      { query: { email: testUsers[0].email }, ...params },
    );

    const res = (await authManagement.find({
      query: { email: testUsers[0].email },
    })) as FindResult<AuthManagement>;

    expect(res.data[0].email).toBe(testUsers[0].email);
    expect(res.data[0].resetToken).toHaveLength(64);
    expect(
      res.data[0].resetTokenCreatedAt &&
        new Date(res.data[0].resetTokenCreatedAt).getTime(),
      // Just check that the created time was around now
    ).toBeGreaterThan(Date.now() - 10000);
  });

  it('server can set tokens to null', async () => {
    const res = await authManagement.patch(
      null,
      {
        resetToken: undefined,
        resetTokenCreatedAt: undefined,
      },
      { query: { email: testUsers[0].email } },
    );

    expect(res[0].resetToken).toBe(null);
    expect(res[0].resetTokenCreatedAt).toBe(null);
  });
});
