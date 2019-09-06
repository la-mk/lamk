import { takeEvery } from 'redux-saga/effects';
import { LocationChangeAction } from 'connected-react-router';
import { LOCATION_CHANGE } from '../modules/navigation/navigation.actions';

function* routeRestrictionsSaga(action: LocationChangeAction) {}

export function* watchRouteRestrictionSaga() {
  yield takeEvery(LOCATION_CHANGE, routeRestrictionsSaga);
}

export default { watchRouteRestrictionSaga };
