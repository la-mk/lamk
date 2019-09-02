import promiseSaga from './sagas/promiseSaga';
import navigationSaga from './sagas/navigationSaga';
import { SagaMiddleware } from 'redux-saga';

const sagas = {
  ...promiseSaga,
  ...navigationSaga,
};

export default function registerSagas(middleware: SagaMiddleware) {
  Object.values(sagas).forEach(saga => middleware.run(saga));
}
