import sessionStorage from 'redux-persist/lib/storage/session';
import { persistReducer } from 'redux-persist';

import orders from './orders.module';

const config = {
  key: 'orders',
  storage: sessionStorage,
};

export default persistReducer(config, orders);
