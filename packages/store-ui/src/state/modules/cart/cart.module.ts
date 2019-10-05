import {
  CartWithProducts,
  CartItemWithProduct,
} from '@lamk/la-sdk/dist/models/cart';

const initialState = { cartWithProducts: null };

const SET_CART_WITH_PRODUCTS = 'cart/SET_CART_WITH_PRODUCTS';
const ADD_CART_ITEM_WITH_PRODUCT = 'cart/ADD_CART_ITEM_WITH_PRODUCT';
const REMOVE_ITEMS_FROM_CART = 'cart/REMOVE_ITEMS_FROM_CART';

export default function cart(state = initialState, action) {
  switch (action.type) {
    case SET_CART_WITH_PRODUCTS:
      return { ...state, cartWithProducts: action.cartWithProducts };

    case REMOVE_ITEMS_FROM_CART:
      return {
        ...state,
        cartWithProducts: { ...state.cartWithProducts, items: [] },
      };

    case ADD_CART_ITEM_WITH_PRODUCT:
      return {
        ...state,
        cartWithProducts: {
          ...(state.cartWithProducts || {}),
          items:
            state.cartWithProducts && state.cartWithProducts.items
              ? [...state.cartWithProducts.items, action.cartItemWithProduct]
              : [action.cartItemWithProduct],
        },
      };

    default:
      return state;
  }
}

export function setCartWithProducts(cartWithProducts: CartWithProducts) {
  return {
    type: SET_CART_WITH_PRODUCTS,
    cartWithProducts: cartWithProducts,
  };
}

export function addCartItemWithProduct(
  cartItemWithProduct: CartItemWithProduct,
) {
  return {
    type: ADD_CART_ITEM_WITH_PRODUCT,
    cartItemWithProduct,
  };
}

export function removeItemsFromCart() {
  return {
    type: REMOVE_ITEMS_FROM_CART,
  };
}
