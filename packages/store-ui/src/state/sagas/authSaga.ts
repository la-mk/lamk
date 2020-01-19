import unionWith from 'lodash/unionWith';
import { call, takeLeading, takeEvery, put, select } from 'redux-saga/effects';
import { LocationChangeAction } from 'connected-next-router';
import { sdk } from '@sradevski/la-sdk';
import { LOGOUT, LOGIN, SIGNUP } from '../modules/auth/auth.module';
import { clearSession, toggleAuthModal } from '../modules/ui/ui.module';
import { setUser } from '../modules/user/user.module';
import { setCartWithProducts } from '../modules/cart/cart.module';
import { getCartWithProducts } from '../modules/cart/cart.selector';
import { CartItemWithProduct } from '@sradevski/la-sdk/dist/models/cart';
import { message } from 'antd';
import { getStore } from '../modules/store/store.selector';

function* afterAuthSaga(authInfo: any, wasAuthenticated: boolean = false) {
  yield put(toggleAuthModal(false));
  // If user was logged in but token has expired, clear out all session and local storage state related to user, and let them browse around.
  if (!authInfo && wasAuthenticated) {
    yield put(clearSession());
  } else if (authInfo) {
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
      const store = yield select(getStore);
      const serverCart = yield call(
        sdk.cart.getCartWithProductsForUser,
        authInfo.user._id,
        store._id,
      );

      const localCart = yield select(getCartWithProducts);

      // TODO: localCart or serverCart might be null, handle it
      const cartItems = unionWith(
        localCart.items,
        serverCart.items,
        (a: any, b: any) => a.product._id === b.product._id,
      );

      yield call(sdk.cart.patch, serverCart._id, {
        items: cartItems
          .filter(item => item.fromStore === store._id)
          .map((item: CartItemWithProduct) => ({
            ...item,
            product: item.product._id,
          })),
      });

      yield put(setCartWithProducts({ ...serverCart, items: cartItems }));
    } catch (err) {
      console.log(err);
    }
  }
}

// Do the auth check and flow.
function* authenticationCheckSaga(action: LocationChangeAction) {
  const oldAuthInfo = yield call(sdk.authentication.getAuthentication);
  const wasAuthenticated = Boolean(oldAuthInfo);

  yield reauthenticateUserSaga();
  const authInfo = yield getAuthenticationSaga();
  yield afterAuthSaga(authInfo, wasAuthenticated);
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
    message.success('Welcome!');
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
    message.success('Welcome!');
    yield afterAuthSaga(authInfo);
  } catch (err) {
    console.log(err);
  }
}

export function* watchAuthenticationCheckSaga() {
  //TODO: Find a better event to listen to, will do for now
  yield takeLeading('persist/REHYDRATE', authenticationCheckSaga);
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
