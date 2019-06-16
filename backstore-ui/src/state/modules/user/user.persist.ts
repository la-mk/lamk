import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

import user from './user.module';

const config = {
  key: 'user',
  storage: storage,
};

export default persistReducer(config, user);
