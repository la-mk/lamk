import sessionStorage from 'redux-persist/lib/storage/session';
import { persistReducer } from 'redux-persist';

import campaigns from './campaigns.module';

const config = {
  key: 'campaigns',
  storage: sessionStorage,
};

export default persistReducer(config, campaigns);
