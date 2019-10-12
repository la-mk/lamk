// Local storage is better here, but for now let's keep it in session instead.
import sessionStorage from 'redux-persist/lib/storage/session';
import { persistReducer } from 'redux-persist';

import categories from './categories.module';

const config = {
  key: 'categories',
  storage: sessionStorage,
};

export default persistReducer(config, categories);
