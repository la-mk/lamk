import requestSagas from './sagas/requestSagas';
import { SagaMiddleware } from 'redux-saga';

const sagas = {
  ...requestSagas,
};

export default function registerSagas(middleware: SagaMiddleware) {
  Object.values(sagas).forEach(saga => middleware.run(saga));
}
