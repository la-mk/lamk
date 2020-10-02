import { persistCombineReducers } from 'redux-persist';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

//TODO: localForage is recommended, but we can add it later on.
import storage from 'redux-persist/es/storage';

import store from './modules/store/store.module';
import products from './modules/products/products.module';
import orders from './modules/orders/orders.module';
import delivery from './modules/delivery/delivery.module';
import categories from './modules/categories/categories.module';
import campaigns from './modules/campaigns/campaigns.module';
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
  campaigns,
  user,
  ui,
  router: connectRouter(history),
});

export default (history: History) =>
  persistCombineReducers(storageConfig, getReducersSet(history) as any);
