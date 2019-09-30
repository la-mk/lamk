import localStorage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

import store from './store.module';

const config = {
  key: 'store',
  storage: localStorage,
};

export default persistReducer(config, store);
