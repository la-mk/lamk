import promiseSagas from './sagas/promiseSagas';
import { SagaMiddleware } from 'redux-saga';

const sagas = {
  ...promiseSagas,
};

export default function registerSagas(middleware: SagaMiddleware) {
  Object.values(sagas).forEach(saga => middleware.run(saga));
}
