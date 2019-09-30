import sessionStorage from 'redux-persist/lib/storage/session';
import { persistReducer } from 'redux-persist';

import ui from './ui.module';

const config = {
  key: 'ui',
  storage: sessionStorage,
};

export default persistReducer(config, ui);
