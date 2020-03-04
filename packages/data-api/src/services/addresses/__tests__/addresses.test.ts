import setup from '../../../server/server';
import { Application } from '@feathersjs/express';
import { NotAuthenticated, NotFound } from '../../../common/errors';
import { Service } from '@feathersjs/feathers';
import { User } from '@sradevski/la-sdk/dist/models/user';
import { Address } from '@sradevski/la-sdk/dist/models/address/address';
import { getExternalUserParams } from '../../../../tests/utils';
import { FindResult } from '@sradevski/la-sdk/dist/setup';

const userFixture = {
  email: 'addresses@fixture.com',
  password: 'supersecret',
};

const user2Fixture = {
  email: 'addresses2@fixture.com',
  password: 'supersecret',
};

const addressFixture = {
  name: 'Test address',
  country: 'MK',
  region: 'Bitola',
  city: 'Bitola',
  zip: '7000',
  street: 'Unknown',
  person: 'Addresses',
  phoneNumber: '1234567',
};

describe('"addresses" service', () => {
  let feathersApp: Application;
  let users: Service<User>;
  let addresses: Service<Address>;
  let testUser: User;
  let testUser2: User;
  let testAddress: Address;

  beforeAll(async () => {
    feathersApp = await setup();
    users = feathersApp.service('users');
    addresses = feathersApp.service('addresses');
    testUser = await users.create(userFixture);
    testUser2 = await users.create(user2Fixture);
    testAddress = await addresses.create(
      {
        ...addressFixture,
        name: 'Test address 2',
      },
      getExternalUserParams(testUser2),
    );
  });

  it('create throws if not authenticated', async () => {
    const addressPromise = addresses.create(addressFixture, {
      provider: 'rest',
    });
    expect(addressPromise).rejects.toThrow(NotAuthenticated);
  });

  it('creates an address for user', async () => {
    const params = getExternalUserParams(testUser);
    const address = await addresses.create(addressFixture, params);
    expect(address).toMatchObject(addressFixture);
    expect(address.addressFor).toBe(testUser._id);
  });

  it('find returns only address of user', async () => {
    const params = getExternalUserParams(testUser);
    const addressesForUser = (await addresses.find(params)) as FindResult<
      Address
    >;
    expect(addressesForUser.total).toBe(1);
    expect(addressesForUser.data[0].name).toBe(addressFixture.name);
  });

  it('get throws notFound when fetching address owned by another user', async () => {
    const params = getExternalUserParams(testUser);
    const addressPromise = addresses.get(testAddress._id, params);
    expect(addressPromise).rejects.toThrow(NotFound);
  });

  it('get returns the address for user', async () => {
    const params = getExternalUserParams(testUser2);
    const address = await addresses.get(testAddress._id, params);
    expect(address).toMatchObject(testAddress);
  });

  it('remove throws notFound when removing address owned by another user', async () => {
    const params = getExternalUserParams(testUser);
    const addressPromise = addresses.get(testAddress._id, params);
    expect(addressPromise).rejects.toThrow(NotFound);
  });

  it('removes an address for user', async () => {
    const params = getExternalUserParams(testUser);
    const newAddress = await addresses.create(
      {
        ...addressFixture,
        name: 'New address',
      },
      params,
    );
    const removedAddress = await addresses.remove(newAddress._id, params);
    expect(removedAddress._id).toBe(newAddress._id);
  });
});
