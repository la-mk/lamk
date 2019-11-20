import authSaga from './sagas/authSaga';
import navigationSaga from './sagas/navigationSaga';
import { SagaMiddleware } from 'redux-saga';

const sagas = {
  ...authSaga,
  ...navigationSaga,
};

export default function registerSagas(middleware: SagaMiddleware) {
  Object.values(sagas).forEach(saga => middleware.run(saga));
}
