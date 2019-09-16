import store from './modules/store/store.persist';
import cart from './modules/cart/cart.persist';
import { combineReducers } from 'redux';

const getReducersSet = () => ({
  store,
  cart,
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
    blacklist: ['store', 'cart'],
  };

  return persistCombineReducers(storageConfig, reducers);
};
