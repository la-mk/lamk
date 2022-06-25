import unionWith from 'lodash/unionWith';
import { SET_USER } from '../modules/user/user.module';
import { takeEvery, select, call, put, all } from 'redux-saga/effects';
import { getStore } from '../modules/store/store.selector';
import { getCartWithProducts } from '../modules/cart/cart.selector';
import { sdk } from '@la-mk/la-sdk';
import { setCartWithProducts } from '../modules/cart/cart.module';
import {
  CartItemWithProduct,
  CartWithProducts,
} from '@la-mk/la-sdk/dist/models/cart';

// We only refresh the local cart when a user logs in, since that is a required action to make an order
function* getRefreshedCart() {
  const cartWithProducts: CartWithProducts = yield select(getCartWithProducts);
  if (!cartWithProducts?.items?.length) {
    return;
  }

  try {
    const updatedItemsPromise = cartWithProducts.items.map(async item => {
      const product = await sdk.product.get(item.product._id);
      const orderProduct = sdk.product.convertToOrderProduct(
        product,
        item.product.attributes,
      );

      if (!orderProduct) {
        return null;
      }

      return {
        ...item,
        product: orderProduct,
      };
    });

    const updatedItems = yield all(updatedItemsPromise);
    return { ...cartWithProducts, items: updatedItems.filter(x => !!x) };
  } catch (err) {
    console.log(err);
  }
}

export function* handleCartForUserSaga({ user }: any) {
  if (!user) {
    return;
  }

  // If logged in, fetch latest cart state and update redux.
  try {
    const store = yield select(getStore);
    // This automatically refreshes the DB cart products, and filters out products that no longer exist.
    const serverCart = yield call(
      sdk.cart.getCartWithProductsForUser,
      user._id,
      store._id,
    );

    // This refreshes the products in the local cart, in case some were removed by the seller or the price changed.
    const localCart = yield getRefreshedCart();

    const cartItems = unionWith(
      localCart?.items ?? [],
      serverCart?.items ?? [],
      (a: any, b: any) =>
        a.product._id === b.product._id &&
        sdk.product.areAttributesEquivalent(
          a.product.attributes,
          b.product.attributes,
        ),
    );

    yield call(sdk.cart.patch, serverCart._id, {
      items: cartItems
        .filter(item => item.fromStore === store._id)
        .map((item: CartItemWithProduct) => ({
          ...item,
          product: {
            id: item.product._id,
            attributes: item.product.attributes,
          },
        })),
    });

    yield put(setCartWithProducts({ ...serverCart, items: cartItems }));
  } catch (err) {
    console.log(err);
  }
}

function* watchCartSetUserSaga() {
  yield takeEvery(SET_USER, handleCartForUserSaga);
}

export default { watchCartSetUserSaga };
