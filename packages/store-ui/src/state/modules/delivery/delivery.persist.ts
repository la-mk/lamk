import localStorage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

import delivery from './delivery.module';

const config = {
  key: 'delivery',
  storage: localStorage,
};

export default persistReducer(config, delivery);
