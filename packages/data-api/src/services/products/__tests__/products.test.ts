import setup from '../../../server/server';
import { Application } from '@feathersjs/express';
import { Service } from '@feathersjs/feathers';
import { User } from '@sradevski/la-sdk/dist/models/user';
import { getExternalUserParams } from '../../../../tests/utils';
import { Product } from '@sradevski/la-sdk/dist/models/product';
// import { sdk } from '@sradevski/la-sdk';
import fixtures from '../../../../tests/fixtures';
import { BadRequest } from '../../../common/errors';

describe('"storeAnalytics" service', () => {
  let feathersApp: Application;
  let products: Service<any>;
  let testUsers: User[];
  let testProducts: Product[];

  beforeAll(async () => {
    feathersApp = await setup();
    products = feathersApp.service('products');
    await fixtures.category(feathersApp, 1);
    testUsers = await fixtures.user(feathersApp, 2);
    testProducts = await fixtures.product(
      feathersApp,
      3,
      getExternalUserParams(testUsers[0]),
    );
  });

  it('creating a product fills in calculated fields correctly for a single variant', async () => {
    const params = getExternalUserParams(testUsers[0]);
    const [newProduct, otherNewProduct] = await fixtures.product(
      feathersApp,
      2,
      params,
      [
        {
          variants: [{ price: 123, discount: 10, sku: '34567', stock: 10 }],
        },
        {
          variants: [{ price: 123, stock: 0 }],
        },
      ],
    );

    expect(newProduct.minCalculatedPrice).toBe(113);
    expect(newProduct.maxCalculatedPrice).toBe(113);
    expect(newProduct.minPrice).toBe(123);
    expect(newProduct.maxPrice).toBe(123);
    expect(newProduct.minDiscount).toBe(10);
    expect(newProduct.maxDiscount).toBe(10);
    expect(newProduct.totalStock).toBe(10);

    expect(otherNewProduct.minCalculatedPrice).toBe(123);
    expect(otherNewProduct.maxCalculatedPrice).toBe(123);
    expect(otherNewProduct.minPrice).toBe(123);
    expect(otherNewProduct.maxPrice).toBe(123);
    expect(otherNewProduct.minDiscount).toBeFalsy();
    expect(otherNewProduct.maxDiscount).toBeFalsy();
    expect(otherNewProduct.totalStock).toBe(0);
  });

  it('patching a product fills in calculated fields correctly for a single variant', async () => {
    const params = getExternalUserParams(testUsers[0]);

    const patchedProduct = await products.patch(
      testProducts[0]._id,
      {
        variants: [{ price: 123, discount: 10, sku: '34567', stock: 10 }],
      },
      params,
    );

    const secondPatchedProduct = await products.patch(
      testProducts[1]._id,
      {
        variants: [{ price: 124, stock: 0 }],
      },
      params,
    );

    expect(patchedProduct.minCalculatedPrice).toBe(113);
    expect(patchedProduct.maxCalculatedPrice).toBe(113);
    expect(patchedProduct.minPrice).toBe(123);
    expect(patchedProduct.maxPrice).toBe(123);
    expect(patchedProduct.minDiscount).toBe(10);
    expect(patchedProduct.maxDiscount).toBe(10);
    expect(patchedProduct.totalStock).toBe(10);

    expect(secondPatchedProduct.minCalculatedPrice).toBe(124);
    expect(secondPatchedProduct.maxCalculatedPrice).toBe(124);
    expect(secondPatchedProduct.minPrice).toBe(124);
    expect(secondPatchedProduct.maxPrice).toBe(124);
    expect(secondPatchedProduct.minDiscount).toBeFalsy();
    expect(secondPatchedProduct.maxDiscount).toBeFalsy();
    expect(secondPatchedProduct.totalStock).toBe(0);
  });

  it('patching a product variants has to supply the complete variants array', async () => {
    expect.assertions(1);
    const params = getExternalUserParams(testUsers[0]);

    const patchPromise = products.patch(
      testProducts[0]._id,
      {
        variants: [{ stock: 10 }],
      },
      params,
    );

    await expect(patchPromise).rejects.toThrow(BadRequest);
  });

  it('user cannot set calculated fields when creating', async () => {
    const params = getExternalUserParams(testUsers[0]);
    const [newProduct] = await fixtures.product(feathersApp, 1, params, {
      variants: [{ price: 123, discount: 10, sku: '34567', stock: 10 }],
      minCalculatedPrice: 10,
      maxCalculatedPrice: 12,
      totalStock: 20,
      minDiscount: 1000,
      maxDiscount: 1200,
      minPrice: 50,
      maxPrice: 20,
    });

    expect(newProduct.minCalculatedPrice).toBe(113);
    expect(newProduct.maxCalculatedPrice).toBe(113);
    expect(newProduct.minPrice).toBe(123);
    expect(newProduct.maxPrice).toBe(123);
    expect(newProduct.minDiscount).toBe(10);
    expect(newProduct.maxDiscount).toBe(10);
    expect(newProduct.totalStock).toBe(10);
  });

  it('user cannot set calculated fields when patching', async () => {
    const params = getExternalUserParams(testUsers[0]);
    const patchedProduct = await products.patch(
      testProducts[2]._id,
      {
        minCalculatedPrice: 10,
        maxCalculatedPrice: 12,
        totalStock: 20,
        minDiscount: 1000,
        maxDiscount: 1200,
        minPrice: 50,
        maxPrice: 20,
      },
      params,
    );

    expect(patchedProduct.minCalculatedPrice).toBe(
      testProducts[2].minCalculatedPrice,
    );
    expect(patchedProduct.maxCalculatedPrice).toBe(
      testProducts[2].maxCalculatedPrice,
    );
    expect(patchedProduct.minPrice).toBe(testProducts[2].minPrice);
    expect(patchedProduct.maxPrice).toBe(testProducts[2].maxPrice);
    expect(patchedProduct.minDiscount).toBeFalsy();
    expect(patchedProduct.maxDiscount).toBeFalsy();
    expect(patchedProduct.totalStock).toBeFalsy();
  });
});
