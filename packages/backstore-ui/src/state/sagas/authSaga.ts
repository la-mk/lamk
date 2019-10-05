import { call, takeLeading, takeEvery, put } from 'redux-saga/effects';
import { LocationChangeAction } from 'connected-react-router';
import { sdk } from '@lamk/la-sdk';
import {
  replaceTo,
  LOCATION_CHANGE,
} from '../modules/navigation/navigation.actions';
import { LOGOUT, LOGIN, SIGNUP } from '../modules/auth/auth.module';
import { clearSession } from '../modules/ui/ui.module';
import { setUser } from '../modules/user/user.module';

const authRoutes = ['/login', '/signup'];

function* afterAuthSaga() {
  const authInfo = yield call(sdk.authentication.getAuthentication);
  yield put(setUser(authInfo.user));
  yield put(replaceTo('/'));
}

function* authenticationCheckSaga(action: LocationChangeAction) {
  let authInfo;

  // If it is an initial render, try to reauthenticate using the existing token.
  if (action.payload.isFirstRendering) {
    try {
      yield call(sdk.authentication.reAuthenticate, false);
    } catch (err) {
      console.log(err);
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
    yield afterAuthSaga();
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

    yield afterAuthSaga();
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

    yield afterAuthSaga();
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
