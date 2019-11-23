import sessionStorage from 'redux-persist/lib/storage/session';

import store from './store.module';
import { persistReducer } from '../../utils';

const config = {
  key: 'store',
  storage: sessionStorage,
};

export default persistReducer(config, store);
