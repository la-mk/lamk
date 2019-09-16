import localStorage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

import cart from './cart.module';

const config = {
  key: 'cart',
  storage: localStorage,
};

export default persistReducer(config, cart);
