import { takeEvery } from 'redux-saga/effects';

import { CLEAR_SESSION } from '../modules/ui/ui.module';

export function clearSessionSaga() {
  // TODO: See if something from localstorage needs to be removed as well.
  sessionStorage.clear();
}

export function* watchClearSessionSaga() {
  yield takeEvery(CLEAR_SESSION, clearSessionSaga);
}

export default { watchClearSessionSaga };
