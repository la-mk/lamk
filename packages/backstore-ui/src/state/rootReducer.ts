import { persistCombineReducers, purgeStoredState } from 'redux-persist';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

//TODO: localForage is recommended, but we can add it later on.
import storage from 'redux-persist/es/storage';

import store from './modules/store/store.persist';
import products from './modules/products/products.persist';
import orders from './modules/orders/orders.persist';
import delivery from './modules/delivery/delivery.persist';
import categories from './modules/categories/categories.persist';
import user from './modules/user/user.module';
import ui from './modules/ui/ui.module';

const storageConfig = {
  key: 'rootStorage',
  storage,
  whitelist: [],
};

const getReducersSet = (history: History) => ({
  store,
  products,
  orders,
  delivery,
  categories,
  user,
  ui,
  router: connectRouter(history),
});

export default (history: History) =>
  persistCombineReducers(storageConfig, getReducersSet(history) as any);
