import omit from 'lodash/omit';
import { takeEvery, takeLatest } from 'redux-saga/effects';
import { analytics } from '../../analytics/';
import { LOCATION_CHANGE } from '../modules/navigation/navigation.actions';
import { LOGOUT } from '../modules/auth/auth.module';
import { SET_USER } from '../modules/user/user.module';

function actionSaga(action) {
  analytics.track(action.type, omit(action, 'type'));
}

function* pageSaga() {
  analytics.page();
}

function* setUserSaga(action: any) {
  if (action.user) {
    analytics.identify(action.user._id);
  }
}

function* logoutSaga() {
  analytics.reset();
}

function* watchAnalyticsActionsSaga() {
  yield takeLatest([], actionSaga);
}

// We don't listen to `login` as that happens before the user is actually logged in, and it is not triggered if there is already token in storage
function* watchAnalyticsSetUserSaga() {
  yield takeLatest(SET_USER, setUserSaga);
}

function* watchAnalyticsLogoutSaga() {
  yield takeLatest(LOGOUT, logoutSaga);
}

function* watchPageSaga() {
  yield takeEvery(LOCATION_CHANGE, pageSaga);
}

export default {
  watchPageSaga,
  watchAnalyticsSetUserSaga,
  watchAnalyticsLogoutSaga,
  watchAnalyticsActionsSaga,
};
