import sessionStorage from 'redux-persist/lib/storage/session';
import { persistReducer } from 'redux-persist';

import user from './user.module';

const config = {
  key: 'user',
  storage: sessionStorage,
};

export default persistReducer(config, user);
