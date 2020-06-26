import merge from 'lodash/merge';
import { Application, Params } from '@feathersjs/feathers';
import { getCrudMethods } from '../setup';
import { OmitServerProperties } from '../utils';
import { Product } from './product';
import { validate, validateSingle } from '../utils/validation';
import v8n from 'v8n';
import { defaultSchemaEntries, DefaultSchema } from '../internal-utils';

export const schema = {
  ...defaultSchemaEntries,
  forUser: v8n().id(),
  items: v8n().every.schema({
    product: v8n().id(),
    fromStore: v8n().id(),
    quantity: v8n()
      .number()
      .positive(),
  }),
};

export interface CartItem {
  product: string;
  fromStore: string;
  quantity: number;
}

export interface CartItemWithProduct extends Omit<CartItem, 'product'> {
  product: Product;
}

export interface Cart extends DefaultSchema {
  forUser: string;
  items: CartItem[];
}

export interface CartWithProducts extends Omit<Cart, 'items'> {
  items: CartItemWithProduct[];
}

export const getCartSdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<Cart>, Cart>(
    client,
    'carts'
  );

  return {
    ...crudMethods,

    findForUser: (userId: string, params?: Params) => {
      const options = {};
      merge(options, params, { query: { forUser: userId } });
      return crudMethods.find(options);
    },

    getCartWithProductsForUser: async (userId: string, storeId?: string) => {
      const cartRes = await crudMethods.find({ query: { forUser: userId } });
      if (cartRes.total < 1) {
        throw new Error('There is no cart for the current user.');
      }

      const cart = cartRes.data[0];
      const productIds = cart.items
        .filter(item => (storeId ? item.fromStore === storeId : true))
        .map(item => item.product);

      const productsRes =
        productIds.length > 0
          ? await client.service('products').find({
              query: { _id: { $in: productIds } },
            })
          : Promise.resolve({ data: [] });

      const products = productsRes.data;

      return {
        ...cart,
        items: cart.items.map(item => ({
          ...item,
          product: products.find(
            (product: Product) => product._id === item.product
          ),
        })),
      } as CartWithProducts;
    },

    addItemToCart: (cartId: string, item: CartItem, params?: Params) => {
      return crudMethods.patch(cartId, { $push: { items: item } }, params);
    },

    removeItemFromCart: (
      cartId: string,
      item: CartItem | CartItemWithProduct,
      params?: Params
    ) => {
      let productId = item.product;
      if (typeof item.product !== 'string') {
        productId = item.product._id;
      }

      return crudMethods.patch(
        cartId,
        { $pull: { items: { product: productId } } },
        params
      );
    },

    changeQuantityForCartItem: (
      cartId: string,
      item: CartItem | CartItemWithProduct,
      quantity: number,
      params?: Params
    ) => {
      let productId = item.product;
      if (typeof item.product !== 'string') {
        productId = item.product._id;
      }

      const options = {};
      merge(options, params, { query: { 'items.product': productId } });
      return crudMethods.patch(
        cartId,
        { $set: { 'items.$.quantity': quantity } },
        options
      );
    },

    validate: (data: Cart, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired);
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    },
  };
};
