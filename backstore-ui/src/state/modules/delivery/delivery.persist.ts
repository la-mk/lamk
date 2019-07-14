import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

import delivery from './delivery.module';

const config = {
  key: 'delivery',
  storage: storage,
};

export default persistReducer(config, delivery);
