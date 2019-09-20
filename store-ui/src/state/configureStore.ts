import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore } from 'redux-persist';
import {
  createRouterMiddleware,
  initialRouterState,
} from 'connected-next-router';

import registerSagas from './rootSaga';
import registerReducers from './rootReducer';
import { MakeStoreOptions } from 'next-redux-wrapper';

export default function configureStore(
  env: string | undefined,
  initialState: any,
  options: MakeStoreOptions,
) {
  return env === 'production'
    ? configureProdStore(initialState, options)
    : configureDevStore(initialState, options);
}

function configureProdStore(initialState: any, options: MakeStoreOptions) {
  return configureDevStore(initialState, options);
}

function configureDevStore(initialState: any, options: MakeStoreOptions) {
  if (options.isServer) {
    return createStore(registerReducers(true), initialState);
  }

  const sagaMiddleware = createSagaMiddleware();
  const routerMiddleware = createRouterMiddleware();
  const composeEnhancers =
    // @ts-ignore
    window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      : compose;

  const enhancer = composeEnhancers(
    applyMiddleware(sagaMiddleware, routerMiddleware),
  );

  const store = createStore(registerReducers(false), initialState, enhancer);
  persistStore(store);
  registerSagas(sagaMiddleware);

  return store;
}
