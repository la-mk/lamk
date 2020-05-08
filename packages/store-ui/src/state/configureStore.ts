import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore } from 'redux-persist';
import { createRouterMiddleware } from 'connected-next-router';
import crosstabSync from './reduxPresistCrosstab';

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
  return configure(initialState, options, compose);
}

function configureDevStore(initialState: any, options: MakeStoreOptions) {
  return configure(
    initialState,
    options,

    options.isServer
      ? compose
      : (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose,
  );
}

function configure(
  initialState: any,
  options: MakeStoreOptions,
  composeEnhancers: typeof compose,
) {
  if (options.isServer) {
    return createStore(registerReducers(true), initialState);
  }

  const sagaMiddleware = createSagaMiddleware();
  const routerMiddleware = createRouterMiddleware();
  const enhancer = composeEnhancers(
    applyMiddleware(sagaMiddleware, routerMiddleware),
  );

  const store = createStore(registerReducers(false), initialState, enhancer);
  persistStore(store);
  crosstabSync(store, { blacklist: ['ui', 'router'] });
  registerSagas(sagaMiddleware);

  return store;
}
