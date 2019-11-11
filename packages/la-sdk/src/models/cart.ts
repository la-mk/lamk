import merge from "lodash/fp/merge";
import { Application, Params } from "@feathersjs/feathers";
import { getCrudMethods } from "../setup";
import { OmitServerProperties } from "../utils/utils";
import { Product } from "./product";
import { validate, validateSingle } from '../utils/modelUtils';
import v8n from 'v8n';

export const schema = {
  forUser: v8n().string().minLength(2).maxLength(63),
  items: v8n().every.schema({ 
      product: v8n().string().minLength(2).maxLength(63),
      fromStore: v8n().string().minLength(2).maxLength(63),
      quantity: v8n().number().positive(),
  }),
}

export interface CartItem {
  product: string;
  fromStore: string;
  quantity: number;
}

export interface CartItemWithProduct extends Omit<CartItem, "product"> {
  product: Product;
}

export interface Cart {
  _id: string;
  forUser: string;
  items: CartItem[];
  createdAt: string;
  modifiedAt: string;
}

export interface CartWithProducts extends Omit<Cart, "items"> {
  items: CartItemWithProduct[];
}

export const getCartSdk = (client: Application) => {
  const crudMethods = getCrudMethods<OmitServerProperties<Cart>, Cart>(
    client,
    "carts"
  );

  return {
    ...crudMethods,

    findForUser: (userId: string, params?: Params) => {
      const options = merge({ query: { forUser: userId } }, params);
      return crudMethods.find(options);
    },

    getCartWithProductsForUser: async (userId: string) => {
      const cartRes = await crudMethods.find({ query: { forUser: userId } });
      if (cartRes.total < 1) {
        throw new Error("There is no cart for the current user.");
      }

      const cart = cartRes.data[0];
      const productIds = cart.items.map((item: CartItem) => item.product);

      const productsRes =
        productIds.length > 0
          ? await client.service("products").find({
              query: { _id: { $in: productIds } }
            })
          : Promise.resolve({ data: [] });

      const products = productsRes.data;

      return {
        ...cart,
        items: cart.items.map(item => ({
          ...item,
          product: products.find(
            (product: Product) => product._id === item.product
          )
        }))
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
      if (typeof item.product !== "string") {
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
      if (typeof item.product !== "string") {
        productId = item.product._id;
      }

      const options = merge({ query: { "items.product": productId } }, params);
      return crudMethods.patch(
        cartId,
        { $set: { "items.$.quantity": quantity } },
        options
      );
    },

    validate: (data: Cart, ignoreRequired = false) => {
      return validate(schema, data, ignoreRequired)
    },
    validateSingle: (val: any, selector: string) => {
      return validateSingle(schema, val, selector);
    }
  };
};
