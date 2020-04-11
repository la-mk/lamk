import { takeEvery, put } from 'redux-saga/effects';

import { CLEAR_SESSION } from '../modules/ui/ui.module';
import { setCartWithProducts } from '../modules/cart/cart.module';
import { setUser } from '../modules/user/user.module';

export function* clearSessionSaga() {
  sessionStorage.clear();
  yield put(setUser(null));
  yield put(setCartWithProducts(null));
}

export function* watchClearSessionSaga() {
  yield takeEvery(CLEAR_SESSION, clearSessionSaga);
}

export default { watchClearSessionSaga };
