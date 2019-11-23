import sessionStorage from 'redux-persist/lib/storage/session';

import delivery from './delivery.module';
import { persistReducer } from '../../utils';

const config = {
  key: 'delivery',
  storage: sessionStorage,
};

export default persistReducer(config, delivery);
