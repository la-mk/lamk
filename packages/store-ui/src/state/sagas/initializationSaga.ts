import { takeEvery, put, call, select } from 'redux-saga/effects';

import { setCampaigns } from '../modules/campaigns/campaigns.module';
import { sdk } from '@la-mk/la-sdk';
import { getCampaigns } from '../modules/campaigns/campaigns.selector';
import { getStore } from '../modules/store/store.selector';
import { SET_UI_LOADED } from '../modules/ui/ui.module';

function* storeLoadedSaga() {
  const store = yield select(getStore);
  const stateCampaigns = yield select(getCampaigns);

  if (!store || stateCampaigns) {
    return;
  }

  try {
    const campaigns = yield call(sdk.campaign.findActiveForStore, store._id);
    yield put(setCampaigns(campaigns.data));
  } catch (err) {
    console.log(err);
  }
}

// Store should be pre-loaded in state on server-side so it should exist when the UI is loaded on client-side
function* watchStoreLoadedSaga() {
  yield takeEvery(SET_UI_LOADED, storeLoadedSaga);
}

export default { watchStoreLoadedSaga };
