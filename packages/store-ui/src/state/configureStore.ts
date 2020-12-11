import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore } from 'redux-persist';
import { createRouterMiddleware } from 'connected-next-router';
import crosstabSync from './reduxPresistCrosstab';
import registerSagas from './rootSaga';
import registerReducers from './rootReducer';
import { MakeStore, createWrapper, Context } from 'next-redux-wrapper';
import env from '../common/env';

export const makeStore: MakeStore<any> = (context: Context) => {
  if (typeof window === 'undefined') {
    return createStore(registerReducers(true), {});
  }

  const composeEnhancers =
    env.NODE_ENV === 'production'
      ? compose
      : (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const sagaMiddleware = createSagaMiddleware();
  const routerMiddleware = createRouterMiddleware();
  const enhancer = composeEnhancers(
    applyMiddleware(sagaMiddleware, routerMiddleware),
  );

  const store = createStore(registerReducers(false), {}, enhancer);
  persistStore(store);
  crosstabSync(store, { blacklist: ['ui', 'router'] });
  registerSagas(sagaMiddleware);

  // @ts-ignore
  if (env.NODE_ENV !== 'production' && module.hot) {
    // @ts-ignore
    module.hot.accept('./rootReducer', () => {
      console.log('Replacing reducer');
      store.replaceReducer(require('./rootReducer').default(false));
    });
  }

  return store;
};

export const { withRedux } = createWrapper<any>(makeStore, {
  debug: env.NODE_ENV !== 'production',
});
