import sessionStorage from 'redux-persist/lib/storage/session';
import { persistReducer } from 'redux-persist';

import delivery from './delivery.module';

const config = {
  key: 'delivery',
  storage: sessionStorage,
};

export default persistReducer(config, delivery);
