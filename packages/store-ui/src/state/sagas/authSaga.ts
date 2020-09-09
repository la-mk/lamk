import {
  call,
  take,
  takeLeading,
  takeEvery,
  put,
  delay,
} from 'redux-saga/effects';
import { sdk } from '@sradevski/la-sdk';
import jwtDecode from 'jwt-decode';
import { LOGOUT, LOGIN, SIGNUP } from '../modules/auth/auth.module';
import { SET_UI_LOADED } from '../modules/ui/ui.module';
import { clearSession, toggleAuthModal } from '../modules/ui/ui.module';
import { setUser } from '../modules/user/user.module';

import { message } from 'antd';
import { LocationChangeAction } from 'connected-next-router/actions';

function* afterAuthSaga(authInfo: any, wasAuthenticated: boolean = false) {
  yield put(toggleAuthModal(false));
  // If user was logged in but token has expired, clear out all session and local storage state related to user, and let them browse around.
  if (!authInfo && wasAuthenticated) {
    yield put(clearSession());
  } else if (authInfo) {
    yield put(setUser(authInfo.user));
  }
}

const isTokenValid = (token: string) => {
  if (!token) {
    return false;
  }

  try {
    const tokenData = jwtDecode(token);
    const expirationTimestamp = tokenData.exp;
    const currentTimestamp = Date.now() / 1000;
    if (currentTimestamp > expirationTimestamp) {
      return false;
    }
  } catch (err) {
    return false;
  }

  return true;
};

const isTokenExpiredError = (err: any) => {
  return err.data?.name === 'TokenExpiredError';
};

const isTokenInvalidError = (err: any) => {
  return err.data?.name === 'JsonWebTokenError';
};

// If there is a concurrent request with `reAuthenticate`, and `reAuthenticate` throws, the other concurrent requests will throw as well
// because there is an assumption that we first reauthenticate before doing server requests (which is not necessary if the routes we hit don't require auth)
// See https://github.com/feathersjs/feathers/issues/1947
export function* reauthenticateUserSaga() {
  try {
    yield call(sdk.authentication.reAuthenticate, true);
  } catch (err) {
    if (isTokenExpiredError(err) || isTokenInvalidError(err)) {
      yield put(clearSession());
    }

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

// Do the auth check and flow.
function* authenticationCheckSaga(action: LocationChangeAction) {
  const accessToken = yield call(sdk.authentication.getAccessToken);
  const wasAuthenticated = Boolean(accessToken);

  // If we know the token is invalid or there is none remove the token, no need to check with the server cause it causes a weird bug (see comment on reauth function)
  if (accessToken && !isTokenValid(accessToken)) {
    try {
      yield call(sdk.authentication.removeAccessToken);
    } catch (err) {
      console.error(err);
    }
  } else if (accessToken) {
    yield reauthenticateUserSaga();
  }

  const authInfo = yield getAuthenticationSaga();
  yield afterAuthSaga(authInfo, wasAuthenticated);
}

function* checkTokenSaga() {
  while (true) {
    try {
      const accessToken = yield call(sdk.authentication.getAccessToken);
      if (accessToken && !isTokenValid(accessToken)) {
        yield call(sdk.authentication.logout);
        yield put(clearSession());
      }
    } catch (err) {
      console.error(err);
    }

    yield delay(15000);
  }
}

export function* logoutSaga() {
  try {
    yield call(sdk.authentication.logout);
    yield put(clearSession());
    message.success('See you soon!');
  } catch (err) {
    message.error(err.message);
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
    message.error(err.message);
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
    message.error(err.message);
  }
}

export function* watchAuthenticationCheckSaga() {
  yield takeLeading(SET_UI_LOADED, authenticationCheckSaga);
}

export function* watchTokenValidationSaga() {
  yield take(SET_UI_LOADED);
  yield checkTokenSaga();
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
  watchTokenValidationSaga,
  watchLogoutSaga,
  watchLoginSaga,
  watchSignupSaga,
};
