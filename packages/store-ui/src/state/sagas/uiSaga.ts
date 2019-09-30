import { takeEvery, put } from 'redux-saga/effects';

import { CLEAR_SESSION } from '../modules/ui/ui.module';
import { setCartWithProducts } from '../modules/cart/cart.module';

export function* clearSessionSaga() {
  sessionStorage.clear();
  yield put(setCartWithProducts(null));
}

export function* watchClearSessionSaga() {
  yield takeEvery(CLEAR_SESSION, clearSessionSaga);
}

export default { watchClearSessionSaga };
