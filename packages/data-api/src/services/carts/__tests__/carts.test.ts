import setup from '../../../server/server';
import { Application } from '@feathersjs/express';
import { Service } from '@feathersjs/feathers';
import { User } from '@sradevski/la-sdk/dist/models/user';
import { getExternalUserParams } from '../../../../tests/utils';
import { Cart } from '@sradevski/la-sdk/dist/models/cart';
import { MethodNotAllowed, NotFound } from '../../../common/errors';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import fixtures from '../../../../tests/fixtures';

describe('"carts" service', () => {
  let feathersApp: Application;
  let carts: Service<Cart>;
  let testUsers: User[];
  let testStores: Store[];
  let testProducts: Product[];

  beforeAll(async () => {
    feathersApp = await setup();
    carts = feathersApp.service('carts');
    await fixtures.category(feathersApp, 1);
    testUsers = await fixtures.user(feathersApp, 2);
    testStores = await fixtures.store(feathersApp, 1, {
      authenticated: true,
      user: testUsers[0],
    });
    testProducts = await fixtures.product(
      feathersApp,
      1,
      getExternalUserParams(testUsers[0]),
    );
  });

  it('create is disallowed for external requests', async () => {
    expect.assertions(1);
    const params = getExternalUserParams(testUsers[0]);
    const cartsPromise = carts.create({}, params);
    await expect(cartsPromise).rejects.toThrow(MethodNotAllowed);
  });

  it('find returns only users cart', async () => {
    const params = getExternalUserParams(testUsers[0]);
    const cart = (await carts.find(params)) as FindResult<Cart>;
    expect(cart.total).toBe(1);
    expect(cart.data[0]._id).toBe(testUsers[0]._id);
  });

  it('get throws with notFound when fetching other user cart', async () => {
    expect.assertions(1);
    const params = getExternalUserParams(testUsers[0]);
    const cartPromise = carts.get(testUsers[1]._id, params);
    await expect(cartPromise).rejects.toThrow(NotFound);
  });

  it('get returns the user cart', async () => {
    const params = getExternalUserParams(testUsers[0]);
    const cart = await carts.get(testUsers[0]._id, params);
    expect(cart.forUser).toBe(testUsers[0]._id);
  });

  it('patch cart adds a product to it', async () => {
    const params = getExternalUserParams(testUsers[0]);
    const cart = await carts.patch(
      testUsers[0]._id,
      {
        items: [
          {
            product: { id: testProducts[0]._id },
            fromStore: testStores[0]._id,
            quantity: 5,
          },
        ],
      },
      params,
    );

    expect(cart.items[0].product.id).toBe(testProducts[0]._id);
    expect(cart.items[0].fromStore).toBe(testStores[0]._id);
  });

  it('remove is disallowed for external requests', async () => {
    expect.assertions(1);
    const params = getExternalUserParams(testUsers[0]);
    const cartPromise = carts.remove(testUsers[1]._id, params);
    await expect(cartPromise).rejects.toThrow(MethodNotAllowed);
  });
});
