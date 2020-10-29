import { authSagas } from './sagas/authSaga';
import { navigationSagas } from './sagas/navigationSaga';
import { SagaMiddleware } from 'redux-saga';

const sagas = {
  ...authSagas,
  ...navigationSagas,
};

export default function registerSagas(middleware: SagaMiddleware) {
  Object.values(sagas).forEach(saga => middleware.run(saga));
}
