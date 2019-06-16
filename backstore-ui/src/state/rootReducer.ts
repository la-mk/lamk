import { persistCombineReducers } from 'redux-persist';
// localForage is recommended, but we can add it later on.
import storage from 'redux-persist/es/storage';

import user from './modules/user/user.persist';
// import notifications from './modules/notifications/notifications.module';

const storageConfig = {
  key: 'rootStorage',
  storage,
  // blacklist: ['notifications'],
};

const reducersSet = {
  user,
  // notifications,
};

export default persistCombineReducers(storageConfig, reducersSet);
