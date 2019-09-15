// import authSaga from './sagas/authSaga';
import { SagaMiddleware } from 'redux-saga';

const sagas = {
  // ...authSaga,
};

export default function registerSagas(middleware: SagaMiddleware) {
  Object.values(sagas).forEach(saga => middleware.run(saga as any));
}
