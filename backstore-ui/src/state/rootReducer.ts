import { persistCombineReducers } from 'redux-persist';
//TODO: localForage is recommended, but we can add it later on.
import storage from 'redux-persist/es/storage';

import store from './modules/store/store.persist';
import products from './modules/products/products.persist';
import orders from './modules/orders/orders.persist';
import delivery from './modules/delivery/delivery.persist';
// import alert from './modules/alert/alert.module';

const storageConfig = {
  key: 'rootStorage',
  storage,
  blacklist: ['store', 'products', 'orders', 'delivery'],
};

const reducersSet = {
  store,
  products,
  orders,
  delivery,
  // alert,
};

export default persistCombineReducers(storageConfig, reducersSet);
