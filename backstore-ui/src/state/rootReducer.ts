import { persistCombineReducers } from 'redux-persist';
//TODO: localForage is recommended, but we can add it later on.
import storage from 'redux-persist/es/storage';

import store from './modules/store/store.persist';
// import alert from './modules/alert/alert.module';

const storageConfig = {
  key: 'rootStorage',
  storage,
  // blacklist: ['alert'],
};

const reducersSet = {
  store,
  // alert,
};

export default persistCombineReducers(storageConfig, reducersSet);
