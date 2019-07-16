import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

import orders from './orders.module';

const config = {
  key: 'orders',
  storage: storage,
};

export default persistReducer(config, orders);
