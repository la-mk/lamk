import store from './modules/store/store.module';
import cart from './modules/cart/cart.persist';
import user from './modules/user/user.module';
import ui from './modules/ui/ui.module';
import delivery from './modules/delivery/delivery.module';
import campaigns from './modules/campaigns/campaigns.module';
import categories from './modules/categories/categories.module';
import storeContents from './modules/storeContents/storeContents.module';
import { routerReducer } from 'connected-next-router';
import { AnyAction, combineReducers, Reducer } from 'redux';
import { HYDRATE } from 'next-redux-wrapper';
import { merge } from 'lodash';

const getReducersSet = () => ({
  store,
  cart,
  user,
  ui,
  delivery,
  campaigns,
  categories,
  storeContents,
  router: routerReducer,
});

const registerReducers = (isServer: boolean) => {
  const reducers = getReducersSet();
  let rootReducer: Reducer;
  if (isServer) {
    rootReducer = combineReducers(reducers);
  } else {
    const { persistCombineReducers } = require('redux-persist');
    const storage = require('redux-persist/lib/storage').default;

    const storageConfig = {
      key: 'rootStorage',
      storage,
      blacklist: [
        'store',
        'cart',
        'user',
        'ui',
        'delivery',
        'campaigns',
        'categories',
        'storeContents',
        'router',
      ],
    };

    rootReducer = persistCombineReducers(storageConfig, reducers);
  }

  return (state: any = {}, action: AnyAction) => {
    switch (action.type) {
      case HYDRATE:
        // TODO: See if this reconsiliation method works.
        return merge({ ...state, ...action.payload });
      default:
        return rootReducer(state, action);
    }
  };
};

export default registerReducers;
