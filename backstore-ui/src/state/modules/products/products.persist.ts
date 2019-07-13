import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

import products from './products.module';

const config = {
  key: 'products',
  storage: storage,
};

export default persistReducer(config, products);
