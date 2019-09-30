import { takeEvery } from 'redux-saga/effects';

import { CLEAR_SESSION } from '../modules/ui/ui.module';

export function clearSessionSaga() {
  sessionStorage.clear();
}

export function* watchClearSessionSaga() {
  yield takeEvery(CLEAR_SESSION, clearSessionSaga);
}

export default { watchClearSessionSaga };
