import sessionStorage from 'redux-persist/lib/storage/session';

import orders from './orders.module';
import { persistReducer } from '../../utils';

const config = {
  key: 'orders',
  storage: sessionStorage,
};

export default persistReducer(config, orders);
