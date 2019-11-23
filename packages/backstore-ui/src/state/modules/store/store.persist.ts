import sessionStorage from 'redux-persist/lib/storage/session';

import store from './store.module';
import { enhanceReducer } from '../../utils';

const config = {
  key: 'store',
  storage: sessionStorage,
};

export default enhanceReducer(store, config);
