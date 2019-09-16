import { takeEvery } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist';

export function rehydrateSaga(action: any) {
  // This is the first event that will happen on the client-side.

  // Do the auth check and flow.
  // If expired, clear out all session and local storage state related to user, and let them browse around.
  // If logged in, fetch latest cart state and update redux.
  // If they log in/sign up, merge their current cart from redux/localStorage with what they had before in the DB.

  if (action.key === 'cart') {
    // If it is for a signed-up user, clear out first.
    if (action.payload.cartWithProducts.forUser) {
    }
  }
}

export function* watchRehydrateSaga() {
  yield takeEvery(REHYDRATE, rehydrateSaga);
}

export default { watchRehydrateSaga };
