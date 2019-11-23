import sessionStorage from 'redux-persist/lib/storage/session';

import delivery from './delivery.module';
import { enhanceReducer } from '../../utils';

const config = {
  key: 'delivery',
  storage: sessionStorage,
};

export default enhanceReducer(delivery, config);
