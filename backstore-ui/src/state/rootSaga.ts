import promiseSaga from './sagas/promiseSaga';
import authSaga from './sagas/authSaga';
import uiSaga from './sagas/uiSaga';
import navigationSaga from './sagas/navigationSaga';
import { SagaMiddleware } from 'redux-saga';

const sagas = {
  ...promiseSaga,
  ...authSaga,
  ...uiSaga,
  ...navigationSaga,
};

export default function registerSagas(middleware: SagaMiddleware) {
  Object.values(sagas).forEach(saga => middleware.run(saga));
}
