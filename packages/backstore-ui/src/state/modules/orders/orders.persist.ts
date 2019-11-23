import sessionStorage from 'redux-persist/lib/storage/session';

import orders from './orders.module';
import { enhanceReducer } from '../../utils';

const config = {
  key: 'orders',
  storage: sessionStorage,
};

export default enhanceReducer(orders, config);
