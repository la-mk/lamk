import { persistCombineReducers } from 'redux-persist';
//TODO: localForage is recommended, but we can add it later on.
import storage from 'redux-persist/es/storage';

import store from './modules/store/store.persist';
import products from './modules/products/products.persist';
import delivery from './modules/delivery/delivery.persist';
// import alert from './modules/alert/alert.module';

const storageConfig = {
  key: 'rootStorage',
  storage,
  blacklist: ['store', 'products', 'delivery'],
};

const reducersSet = {
  store,
  products,
  delivery,
  // alert,
};

export default persistCombineReducers(storageConfig, reducersSet);
