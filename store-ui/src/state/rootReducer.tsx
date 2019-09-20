import store from './modules/store/store.persist';
import cart from './modules/cart/cart.persist';
import user from './modules/user/user.persist';
import ui from './modules/ui/ui.persist';
import delivery from './modules/delivery/delivery.persist';
import { routerReducer } from 'connected-next-router';
import { combineReducers } from 'redux';

const getReducersSet = () => ({
  store,
  cart,
  user,
  ui,
  delivery,
  router: routerReducer,
});

export default (isServer: boolean) => {
  const reducers = getReducersSet();
  if (isServer) {
    return combineReducers(reducers);
  }

  const { persistCombineReducers } = require('redux-persist');
  const storage = require('redux-persist/lib/storage').default;

  const storageConfig = {
    key: 'rootStorage',
    storage,
    blacklist: ['store', 'cart', 'user', 'ui', 'delivery', 'router'],
  };

  return persistCombineReducers(storageConfig, reducers);
};
