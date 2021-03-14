import localStorage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

import analytics from './analytics.module';

const config = {
  key: 'analytics',
  storage: localStorage,
};

export default persistReducer(config, analytics);
