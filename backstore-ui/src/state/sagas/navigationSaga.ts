import { call, takeEvery, put, cancelled } from 'redux-saga/effects';
import { LocationChangeAction } from 'connected-react-router';
import { sdk } from 'la-sdk';
import { replaceTo } from '../modules/navigation/navigation.actions';

const authRoutes = ['/login', '/signup'];

function* navigationSaga(action: LocationChangeAction) {
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
    yield put(replaceTo('/login'));
  }
}

export function* watchNavigationSaga() {
  yield takeEvery('@@router/LOCATION_CHANGE', navigationSaga);
}

export default { watchNavigationSaga };
