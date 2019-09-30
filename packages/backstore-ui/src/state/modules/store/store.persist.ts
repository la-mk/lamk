import sessionStorage from 'redux-persist/lib/storage/session';
import { persistReducer } from 'redux-persist';

import store from './store.module';

const config = {
  key: 'store',
  storage: sessionStorage,
};

export default persistReducer(config, store);
