import sessionStorage from 'redux-persist/lib/storage/session';
import { persistReducer } from 'redux-persist';

import products from './products.module';

const config = {
  key: 'products',
  storage: sessionStorage,
};

export default persistReducer(config, products);
