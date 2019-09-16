import { CartWithProducts, CartItemWithProduct } from 'la-sdk/dist/models/cart';

const initialState = { cartWithProducts: null };

const SET_CART_WITH_PRODUCTS = 'cart/SET_CART_WITH_PRODUCTS';
const ADD_CART_ITEM_WITH_PRODUCT = 'cart/ADD_CART_ITEM_WITH_PRODUCT';

export default function cart(state = initialState, action) {
  switch (action.type) {
    case SET_CART_WITH_PRODUCTS:
      return { ...state, cartWithProducts: action.cartWithProducts };

    case ADD_CART_ITEM_WITH_PRODUCT:
      return {
        ...state,
        cartWithProducts: {
          ...state.cartWithProducts,
          items: [...state.cartWithProducts.items, action.cartItemWithProduct],
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
