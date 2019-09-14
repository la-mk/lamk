export const reducer = (state: any = {}, action) => {
  switch (action.type) {
    case 'SET_STORE':
      return { ...state, store: action.payload };

    case 'SET_CART_WITH_PRODUCTS':
      return { ...state, cartWithProducts: action.payload };

    case 'ADD_PRODUCT_TO_CART':
      return {
        ...state,
        cartWithProducts: {
          ...state.cartWithProducts,
          items: [...state.cartWithProducts.items, action.payload],
        },
      };

    default:
      return state;
  }
};
