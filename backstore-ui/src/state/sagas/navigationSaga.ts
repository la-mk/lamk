import { takeEvery, select, put, call } from 'redux-saga/effects';
import {
  LOCATION_CHANGE,
  replaceTo,
} from '../modules/navigation/navigation.actions';
import { getStore } from '../modules/store/store.selector';
import { sdk } from 'la-sdk';
import { setStore } from '../modules/store/store.module';
import { LocationChangeAction } from 'connected-react-router';
import { getUser } from '../modules/user/user.selector';

// We want to fetch the store info on every navigation if it is missing, as it is the only mandatory data for everything else
function* storeStateSaga(action: LocationChangeAction) {
  const store = yield select(getStore);
  const user = yield select(getUser);

  if (user && !store) {
    const stores = yield call(sdk.store.find);

    if (stores.total > 0) {
      yield put(setStore(stores.data[0]));
    } else if (!action.payload.location.pathname.includes('/onboarding')) {
      // If they don't have a store created, go to onboarding.
      yield put(replaceTo('/onboarding'));
    }
  }
}

export function* watchStoreStateSaga() {
  yield takeEvery(LOCATION_CHANGE, storeStateSaga);
}

export default { watchStoreStateSaga };
