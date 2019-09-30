import { persistCombineReducers } from 'redux-persist';
import { connectRouter } from 'connected-react-router';

//TODO: localForage is recommended, but we can add it later on.
import storage from 'redux-persist/es/storage';

import store from './modules/store/store.persist';
import products from './modules/products/products.persist';
import orders from './modules/orders/orders.persist';
import delivery from './modules/delivery/delivery.persist';
import user from './modules/user/user.module';
import { History } from 'history';
// import alert from './modules/alert/alert.module';

const storageConfig = {
  key: 'rootStorage',
  storage,
  blacklist: ['store', 'products', 'orders', 'delivery', 'user', 'router'],
};

const getReducersSet = (history: History) => ({
  store,
  products,
  orders,
  delivery,
  user,
  router: connectRouter(history),
  // alert,
});

export default (history: History) =>
  persistCombineReducers(storageConfig, getReducersSet(history) as any);
