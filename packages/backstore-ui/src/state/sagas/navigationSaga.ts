import { takeLeading, select, put, call } from 'redux-saga/effects';
import {
  LOCATION_CHANGE,
  replaceTo,
} from '../modules/navigation/navigation.actions';
import { getStore } from '../modules/store/store.selector';
import { sdk } from '@sradevski/la-sdk';
import { setStore } from '../modules/store/store.module';
import { LocationChangeAction } from 'connected-react-router';
import { getUser } from '../modules/user/user.selector';
import { SET_USER } from '../modules/user/user.module';
import { setUiReady } from '../modules/ui/ui.module';

// We want to fetch the store info on every navigation if it is missing, as it is the only mandatory data for everything else
function* storeStateSaga(action: LocationChangeAction) {
  const store = yield select(getStore);
  const user = yield select(getUser);

  if (user && !store) {
    const stores = yield call(sdk.store.findOwned, user._id);
    const isPathOnboarding = document.location.pathname.includes('/onboarding');
    const isPathDashboard = document.location.pathname.includes('/dashboard');

    if (stores.total > 0) {
      yield put(setStore(stores.data[0]));

      // Basically if it is a login, signup, reset password page, but they are logged in already, redirect them to the dashboard.
      if (!isPathOnboarding && !isPathDashboard) {
        yield put(replaceTo('/dashboard'));
      }
    } else if (!isPathOnboarding) {
      // If they don't have a store created, go to onboarding.
      yield put(replaceTo('/onboarding'));
    }

    yield put(setUiReady(true));
  }
}

export function* watchStoreStateSaga() {
  yield takeLeading([LOCATION_CHANGE, SET_USER], storeStateSaga);
}

export const navigationSagas = { watchStoreStateSaga };
