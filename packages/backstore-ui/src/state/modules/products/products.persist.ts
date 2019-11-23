import sessionStorage from 'redux-persist/lib/storage/session';

import products from './products.module';
import { persistReducer } from '../../utils';

const config = {
  key: 'products',
  storage: sessionStorage,
};

export default persistReducer(config, products);
