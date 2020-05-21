import { takeEvery, put } from 'redux-saga/effects';

import { CLEAR_SESSION, setPreviousPage } from '../modules/ui/ui.module';
import { LOCATION_CHANGE } from '../modules/navigation/navigation.actions';
import { setCartWithProducts } from '../modules/cart/cart.module';
import { setUser } from '../modules/user/user.module';

export function* clearSessionSaga() {
  sessionStorage.clear();
  yield put(setUser(null));
  yield put(setCartWithProducts(null));
}

function* locationChangeSaga() {
  const previousPage = location.href;
  yield put(setPreviousPage(previousPage));
}

export function* watchClearSessionSaga() {
  yield takeEvery(CLEAR_SESSION, clearSessionSaga);
}

function* watchUiLocationChangeSaga() {
  yield takeEvery(LOCATION_CHANGE, locationChangeSaga);
}

export default { watchClearSessionSaga, watchUiLocationChangeSaga };
