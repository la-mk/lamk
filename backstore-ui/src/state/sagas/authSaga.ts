import { call, takeEvery, put } from 'redux-saga/effects';
import { LocationChangeAction } from 'connected-react-router';
import { sdk } from 'la-sdk';
import {
  replaceTo,
  LOCATION_CHANGE,
} from '../modules/navigation/navigation.actions';
import { LOGOUT, LOGIN, SIGNUP } from '../modules/auth/auth.module';
import { clearSession } from '../modules/ui/ui.module';
import { setStore } from '../modules/store/store.module';

const authRoutes = ['/login', '/signup'];

function* authenticationCheckSaga(action: LocationChangeAction) {
  let authInfo;

  // If it is an initial render, try to reauthenticate to the user is populated in the SDK.
  if (action.payload.isFirstRendering) {
    try {
      yield call(sdk.authentication.reAuthenticate, false);
      // Try to get the user from the SDK if the user is authenticated
    } catch (err) {
      //Ignore error, since it means the user couldn't be reauthenticated
    }
  }

  try {
    authInfo = yield call(sdk.authentication.getAuthentication);
  } catch (err) {
    console.log(err);
  }

  const isAuthRoute = authRoutes.includes(action.payload.location.pathname);

  // If the user is already logged in, just redirect home.
  if (authInfo && isAuthRoute) {
    yield put(replaceTo('/'));
  }

  // If the user is not logged in, redirect to login page.
  if (!authInfo && !isAuthRoute) {
    yield put(clearSession());
    yield put(replaceTo('/login'));
  }
}

export function* logoutSaga() {
  try {
    yield call(sdk.authentication.logout);
    yield put(clearSession());
    yield put(replaceTo('/login'));
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
    const stores = yield call(sdk.store.find);

    if (stores.total > 0) {
      yield put(setStore(stores.data[0]));
    }

    yield put(replaceTo('/'));
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
    yield put(replaceTo('/'));
  } catch (err) {
    console.log(err);
  }
}

export function* watchAuthenticationCheckSaga() {
  yield takeEvery(LOCATION_CHANGE, authenticationCheckSaga);
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
