import { persistCombineReducers } from 'redux-persist';
//TODO: localForage is recommended, but we can add it later on.
import storage from 'redux-persist/es/storage';

import store from './modules/store/store.persist';
// import notifications from './modules/notifications/notifications.module';

const storageConfig = {
  key: 'rootStorage',
  storage,
  // blacklist: ['notifications'],
};

const reducersSet = {
  store,
  // notifications,
};

export default persistCombineReducers(storageConfig, reducersSet);
