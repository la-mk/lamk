import { Product } from '@la-mk/la-sdk/dist/models/product';

const initialState: { products: Product[]; groups?: string[] } = {
  products: [],
  groups: undefined,
};

const SET_PRODUCTS = 'products/SET_PRODUCTS';
const ADD_PRODUCT = 'products/ADD_PRODUCT';
const PATCH_PRODUCT = 'products/PATCH_PRODUCT';
const REMOVE_PRODUCT = 'products/REMOVE_PRODUCT';

const SET_GROUPS = 'products/SET_GROUPS';

export default function products(state = initialState, action: any) {
  switch (action.type) {
    case SET_PRODUCTS: {
      return {
        ...state,
        products: action.products,
      };
    }
    case ADD_PRODUCT: {
      return {
        ...state,
        products: [...state.products, action.product],
      };
    }
    case PATCH_PRODUCT: {
      return {
        ...state,
        products: state.products.map(product => {
          if (product._id === action.product._id) {
            return action.product;
          }

          return product;
        }),
      };
    }
    case REMOVE_PRODUCT: {
      return {
        ...state,
        products: state.products.filter(
          (product: Product) => product._id !== action.id,
        ),
      };
    }
    case SET_GROUPS: {
      return {
        ...state,
        groups: action.groups,
      };
    }
    default:
      return state;
  }
}

export function setProducts(products: Product[]) {
  return {
    type: SET_PRODUCTS,
    products,
  };
}

export function addProduct(product: Product) {
  return {
    type: ADD_PRODUCT,
    product,
  };
}

export function patchProduct(product: Product) {
  return {
    type: PATCH_PRODUCT,
    product,
  };
}

export function removeProduct(id: string) {
  return {
    type: REMOVE_PRODUCT,
    id,
  };
}

export function setGroups(groups: string[]) {
  return {
    type: SET_GROUPS,
    groups,
  };
}
