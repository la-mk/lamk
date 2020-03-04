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

const userFixture = {
  email: 'carts@fixture.com',
  password: 'supersecret',
};

const user2Fixture = {
  email: 'carts2@fixture.com',
  password: 'supersecret',
};

const storeFixture = {
  name: 'Test store',
  slug: 'carts-test',
  logo: '2345',
  company: {
    companyName: 'Test',
    companyAddress: 'Test',
    registryNumber: 'Test',
    taxNumber: 'Test',
  },
  contact: {
    email: 'carts@test.com',
    phoneNumber: '12345',
  },
  isPublished: true,
};

const productFixture: Partial<Product> = {
  name: 'Test product',
  unit: 'item',
  price: 1234,
  category: 'some-category',
  images: [] as string[],
  groups: [] as string[],
};

describe('"carts" service', () => {
  let feathersApp: Application;
  let users: Service<User>;
  let carts: Service<Cart>;
  let stores: Service<Store>;
  let products: Service<Product>;
  let testUser: User;
  let testUser2: User;
  let testStore: Store;
  let testProduct: Product;

  beforeAll(async () => {
    feathersApp = await setup();
    users = feathersApp.service('users');
    carts = feathersApp.service('carts');
    stores = feathersApp.service('stores');
    products = feathersApp.service('products');
    testUser = await users.create(userFixture);
    testUser2 = await users.create(user2Fixture);
    testStore = await stores.create(storeFixture, {
      authenticated: true,
      user: testUser,
    });
    testProduct = await products.create(
      productFixture,
      getExternalUserParams(testUser),
    );
  });

  it('create is disallowed for external requests', async () => {
    const params = getExternalUserParams(testUser);
    const cartsPromise = carts.create({}, params);
    expect(cartsPromise).rejects.toThrow(MethodNotAllowed);
  });

  it('find returns only users cart', async () => {
    const params = getExternalUserParams(testUser);
    const cart = (await carts.find(params)) as FindResult<Cart>;
    expect(cart.total).toBe(1);
    expect(cart.data[0]._id).toBe(testUser._id);
  });

  it('get throws with notFound when fetching other user cart', async () => {
    const params = getExternalUserParams(testUser);
    const cartPromise = carts.get(testUser2._id, params);
    expect(cartPromise).rejects.toThrow(NotFound);
  });

  it('get returns the user cart', async () => {
    const params = getExternalUserParams(testUser);
    const cart = await carts.get(testUser._id, params);
    expect(cart.forUser).toBe(testUser._id);
  });

  it('patch cart adds a product to it', async () => {
    const params = getExternalUserParams(testUser);
    const cart = await carts.patch(
      testUser._id,
      {
        items: [
          { product: testProduct._id, fromStore: testStore._id, quantity: 5 },
        ],
      },
      params,
    );

    expect(cart.items[0].product).toBe(testProduct._id);
    expect(cart.items[0].fromStore).toBe(testStore._id);
  });

  it('remove is disallowed for external requests', async () => {
    const params = getExternalUserParams(testUser);
    const cartPromise = carts.remove(testUser2._id, params);
    expect(cartPromise).rejects.toThrow(MethodNotAllowed);
  });
});
