import sessionStorage from 'redux-persist/lib/storage/session';

import products from './products.module';
import { enhanceReducer } from '../../utils';

const config = {
  key: 'products',
  storage: sessionStorage,
};

export default enhanceReducer(products, config);
