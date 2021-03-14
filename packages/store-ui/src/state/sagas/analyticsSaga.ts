import omit from 'lodash/omit';
import { takeEvery, takeLatest, select, call } from 'redux-saga/effects';
import { analytics } from '../../common/analytics';
import { LOGOUT } from '../modules/auth/auth.module';
import { SET_USER } from '../modules/user/user.module';
import { SET_UI_LOADED } from '../modules/ui/ui.module';
import { getStore } from '../modules/store/store.selector';
import {
  TRACK_EVENT,
  CONSENTS_CHANGE,
  TrackEventPayload,
} from '../modules/analytics/analytics.module';
import { LOCATION_CHANGE } from '../modules/navigation/navigation.actions';
import { session, AnalyticsEvents } from '@la-mk/analytics';
import { getConsents } from '../modules/analytics/analytics.selector';
import { getUser } from '../modules/user/user.selector';
import { REHYDRATE } from 'redux-persist/lib/constants';

const eventsQueue: { name: string; payload: any }[] = [];

function* storeLoadedSaga() {
  // If the site is loaded from scratch multiple times within a session, don't log anymore.
  const sessionExpired = session.isSessionExpired();
  if (!sessionExpired) {
    return;
  }

  session.initializeSession();
  yield trackEventSaga({
    type: TRACK_EVENT,
    payload: { eventName: AnalyticsEvents.openStore, page: location.href },
  });
}

function* setUserSaga(action: any) {
  const consents = yield select(getConsents);

  if (action.user && consents?.analytics) {
    analytics.identify(action.user._id);
  }
}

function* trackEventSaga(action: { type: string; payload: TrackEventPayload }) {
  const store = yield select(getStore);
  const consents = yield select(getConsents);

  const eventPayload = {
    storeId: store._id,
    ...session.getSessionDefaultProperties(),
    ...omit(action.payload, ['eventName']),
  };

  if (consents?.analytics) {
    try {
      analytics.track(action.payload.eventName, eventPayload);
    } catch (err) {
      console.debug(err);
    }
  } else if (consents == null) {
    eventsQueue.push({ name: action.payload.eventName, payload: eventPayload });
  }
}

function* logoutSaga() {
  // Initialize a new session after logging out.
  analytics.reset();
  session.initializeSession();
}

function* locationChangeSaga() {
  const sessionInfo = session.getSessionInfo();
  if (!sessionInfo) {
    return;
  }

  // Reset the time on every navigation.
  sessionInfo.startTimestamp = Date.now();
  sessionInfo.previousPage = location.href;
  sessionInfo.pageVisits += 1;
  session.setSessionInfo(sessionInfo);
}

function* consentsChangeSaga() {
  const consents = yield select(getConsents);

  if (consents?.analytics) {
    const user = yield select(getUser);

    try {
      yield call(analytics.optIn);
      if (user?._id) {
        yield call(analytics.identify, user._id);
      }

      while (eventsQueue.length > 0) {
        const event = eventsQueue.shift();
        yield call(analytics.track, event.name, event.payload);
      }
    } catch (err) {
      console.debug(err);
    }
  }
}

// We don't listen to `login` as that happens before the user is actually logged in, and it is not triggered if there is already token in storage
function* watchAnalyticsSetUserSaga() {
  yield takeLatest(SET_USER, setUserSaga);
}

function* watchAnalyticsLogoutSaga() {
  yield takeLatest(LOGOUT, logoutSaga);
}

// Store should be pre-loaded in state on server-side so it should exist when the UI is loaded on client-side
function* watchAnalyticsStoreLoadedSaga() {
  yield takeEvery(SET_UI_LOADED, storeLoadedSaga);
}

function* watchTrackEventSaga() {
  yield takeEvery(TRACK_EVENT, trackEventSaga);
}

function* watchAnalyticsLocationChangeSaga() {
  yield takeEvery(LOCATION_CHANGE, locationChangeSaga);
}

function* watchConsentsChangeSaga() {
  yield takeLatest([REHYDRATE, CONSENTS_CHANGE], consentsChangeSaga);
}

export default {
  watchTrackEventSaga,
  watchAnalyticsLocationChangeSaga,
  watchAnalyticsStoreLoadedSaga,
  watchAnalyticsSetUserSaga,
  watchAnalyticsLogoutSaga,
  watchConsentsChangeSaga,
};
