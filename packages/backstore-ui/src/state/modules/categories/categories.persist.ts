// Local storage is better here, but for now let's keep it in session instead.
import sessionStorage from 'redux-persist/lib/storage/session';
import categories from './categories.module';
import { persistReducer } from '../../utils';

const config = {
  key: 'categories',
  storage: sessionStorage,
};

export default persistReducer(config, categories);
