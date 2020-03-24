import setup from '../../../server/server';
import { Application } from '@feathersjs/express';
import { NotAuthenticated, NotFound } from '../../../common/errors';
import { Service } from '@feathersjs/feathers';
import { User } from '@sradevski/la-sdk/dist/models/user';
import { Address } from '@sradevski/la-sdk/dist/models/address/address';
import { getExternalUserParams } from '../../../../tests/utils';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import fixtures from '../../../../tests/fixtures';

describe('"addresses" service', () => {
  let feathersApp: Application;
  let addresses: Service<Address>;
  let testUsers: User[];
  let testAddresses: Address[];

  beforeAll(async () => {
    feathersApp = await setup();
    addresses = feathersApp.service('addresses');
    testUsers = await fixtures.user(feathersApp, 2);
    testAddresses = await fixtures.address(
      feathersApp,
      2,
      getExternalUserParams(testUsers[1]),
    );
  });

  it('create throws if not authenticated', async () => {
    expect.assertions(1);
    const addressPromise = fixtures.address(feathersApp, 1, {
      provider: 'rest',
    });
    await expect(addressPromise).rejects.toThrow(NotAuthenticated);
  });

  it('creates an address for user', async () => {
    const params = getExternalUserParams(testUsers[0]);
    const [address] = await fixtures.address(feathersApp, 1, params);
    expect(address.addressFor).toBe(testUsers[0]._id);
  });

  it('find returns only address of user', async () => {
    const params = getExternalUserParams(testUsers[0]);
    const addressesForUser = (await addresses.find(params)) as FindResult<
      Address
    >;
    expect(addressesForUser.total).toBe(1);
  });

  it('get throws notFound when fetching address owned by another user', async () => {
    expect.assertions(1);
    const params = getExternalUserParams(testUsers[0]);
    const addressPromise = addresses.get(testAddresses[0]._id, params);
    await expect(addressPromise).rejects.toThrow(NotFound);
  });

  it('get returns the address for user', async () => {
    const params = getExternalUserParams(testUsers[1]);
    const address = await addresses.get(testAddresses[0]._id, params);
    expect(address).toMatchObject(testAddresses[0]);
  });

  it('remove throws notFound when removing address owned by another user', async () => {
    expect.assertions(1);
    const params = getExternalUserParams(testUsers[0]);
    const addressPromise = addresses.remove(testAddresses[0]._id, params);
    await expect(addressPromise).rejects.toThrow(NotFound);
  });

  it('removes an address for user', async () => {
    const params = getExternalUserParams(testUsers[0]);
    const [newAddress] = await fixtures.address(feathersApp, 1, params, [
      {
        name: 'New address',
      },
    ]);
    const removedAddress = await addresses.remove(newAddress._id, params);
    expect(removedAddress._id).toBe(newAddress._id);
  });
});
