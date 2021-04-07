import { call, takeLeading, takeEvery, put } from 'redux-saga/effects';
import { LocationChangeAction } from 'connected-react-router';
import { sdk } from '@la-mk/la-sdk';
import {
  replaceTo,
  LOCATION_CHANGE,
} from '../modules/navigation/navigation.actions';
import { LOGOUT, LOGIN, SIGNUP } from '../modules/auth/auth.module';
import { clearSession, setUiReady } from '../modules/ui/ui.module';
import { setUser } from '../modules/user/user.module';
import { toast } from '@la-mk/blocks-ui';
import { User } from '@la-mk/la-sdk/dist/models/user';

const authRoutes = ['/login', '/signup', '/forgotPassword', '/resetPassword'];

function* afterAuthSaga() {
  try {
    const authInfo = (yield call(sdk.authentication.getAuthentication)) as {
      user: User;
    };
    if (authInfo) {
      yield put(setUser(authInfo.user));
    }
    return authInfo;
  } catch (err) {
    console.log(err);
  }
}

function* authenticationCheckSaga(action: LocationChangeAction) {
  // If it is an initial render, try to reauthenticate using the existing token.
  if (action.payload.isFirstRendering) {
    try {
      yield call(sdk.authentication.reAuthenticate, false);
    } catch (err) {
      console.log(err);
      //Ignore error, since it means the user couldn't be reauthenticated
    }
  }

  const authInfo = (yield call(afterAuthSaga)) as { user: User };
  const isAuthRoute = authRoutes.includes(action.payload.location.pathname);

  // If the user is not logged in, redirect to login page.
  if (!authInfo && !isAuthRoute) {
    yield put(clearSession());
    yield put(replaceTo('/login'));
  }

  yield put(setUiReady(true));
}

export function* logoutSaga() {
  try {
    yield call(sdk.authentication.logout);
    yield put(clearSession());
    yield put(replaceTo('/login'));
  } catch (err) {
    toast.error(err.message);
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
    toast.error(err.message);
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
    toast.error(err.message);
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

export const authSagas = {
  watchAuthenticationCheckSaga,
  watchLogoutSaga,
  watchLoginSaga,
  watchSignupSaga,
};
