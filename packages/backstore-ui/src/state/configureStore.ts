import { createStore, applyMiddleware, compose } from 'redux';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import { persistStore } from 'redux-persist';

import registerSagas from './rootSaga';
import registerReducers from './rootReducer';

export const history = createBrowserHistory();

export default function configureStore(env?: string) {
  return env === 'production' ? configureProdStore() : configureDevStore();
}

function configureProdStore() {
  return configureDevStore();
}

function configureDevStore() {
  const sagaMiddleware = createSagaMiddleware();
  const composeEnhancers =
    // @ts-ignore
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const enhancer = composeEnhancers(
    applyMiddleware(sagaMiddleware, routerMiddleware(history)),
  );

  const store = createStore(registerReducers(history), enhancer);
  const persistor = persistStore(store);

  registerSagas(sagaMiddleware);

  return { persistor, store };
}
