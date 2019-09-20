import merge from 'lodash/merge';
import { call, takeLeading, takeEvery, put, select } from 'redux-saga/effects';
import { LocationChangeAction } from 'connected-next-router';
import { sdk } from 'la-sdk';
import { LOCATION_CHANGE } from '../modules/navigation/navigation.actions';
import { LOGOUT, LOGIN, SIGNUP } from '../modules/auth/auth.module';
import { clearSession } from '../modules/ui/ui.module';
import { setUser } from '../modules/user/user.module';
import { setCartWithProducts } from '../modules/cart/cart.module';
import { getCartWithProducts } from '../modules/cart/cart.selector';
import { CartItemWithProduct } from 'la-sdk/dist/models/cart';
import Item from 'antd/lib/list/Item';

function* afterAuthSaga(authInfo: any) {
  // If expired, clear out all session and local storage state related to user, and let them browse around.
  if (!authInfo) {
    yield put(clearSession());
  } else {
    yield put(setUser(authInfo.user));
    yield handleCartForUserSaga(authInfo);
  }
}

export function* reauthenticateUserSaga() {
  try {
    yield call(sdk.authentication.reAuthenticate, false);
  } catch (err) {
    console.log(err);
    //Ignore error, since it means the user couldn't be reauthenticated
  }
}

export function* getAuthenticationSaga() {
  try {
    const authInfo = yield call(sdk.authentication.getAuthentication);
    return authInfo;
  } catch (err) {
    console.log(err);
    yield null;
  }
}

export function* handleCartForUserSaga(authInfo: any) {
  // If logged in, fetch latest cart state and update redux.
  if (authInfo) {
    try {
      const serverCart = yield call(
        sdk.cart.getCartWithProductsForUser,
        authInfo.user._id,
      );

      const localCart = yield select(getCartWithProducts);

      merge(serverCart, localCart);

      yield call(sdk.cart.patch, serverCart._id, {
        items: serverCart.items.map((item: CartItemWithProduct) => ({
          ...item,
          product: item.product._id,
        })),
      });

      yield put(setCartWithProducts(serverCart));
    } catch (err) {
      console.log(err);
    }
  }
}

// Do the auth check and flow.
// TODO: If they log in/sign up, merge their current cart from redux/localStorage with what they had before in the DB.
function* authenticationCheckSaga(action: LocationChangeAction) {
  yield reauthenticateUserSaga();
  const authInfo = yield getAuthenticationSaga();
  yield afterAuthSaga(authInfo);
}

export function* logoutSaga() {
  try {
    yield call(sdk.authentication.logout);
    yield put(clearSession());
  } catch (err) {
    console.log(err);
  }
}

export function* loginSaga(action: any) {
  try {
    yield call(sdk.authentication.authenticate, {
      ...action.payload.credentials,
      strategy: action.payload.strategy,
    });

    const authInfo = yield getAuthenticationSaga();
    yield afterAuthSaga(authInfo);
  } catch (err) {
    console.log(err);
  }
}

export function* signupSaga(action: any) {
  try {
    yield call(sdk.user.create, action.payload.credentials);
    yield call(sdk.authentication.authenticate, {
      ...action.payload.credentials,
      strategy: action.payload.strategy,
    });

    const authInfo = yield getAuthenticationSaga();
    yield afterAuthSaga(authInfo);
  } catch (err) {
    console.log(err);
  }
}

export function* watchAuthenticationCheckSaga() {
  yield takeLeading(LOCATION_CHANGE, authenticationCheckSaga);
}

export function* watchLogoutSaga() {
  yield takeEvery(LOGOUT, logoutSaga);
}

export function* watchLoginSaga() {
  yield takeEvery(LOGIN, loginSaga);
}

export function* watchSignupSaga() {
  yield takeEvery(SIGNUP, signupSaga);
}

export default {
  watchAuthenticationCheckSaga,
  watchLogoutSaga,
  watchLoginSaga,
  watchSignupSaga,
};
