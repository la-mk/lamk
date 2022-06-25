import authSaga from './sagas/authSaga';
import uiSaga from './sagas/uiSaga';
import analyticsSaga from './sagas/analyticsSaga';
import cartSaga from './sagas/cartSaga';
import initializationSaga from './sagas/initializationSaga';
import { SagaMiddleware } from 'redux-saga';

const sagas = {
  ...authSaga,
  ...uiSaga,
  ...analyticsSaga,
  ...initializationSaga,
  ...cartSaga,
};

export default function registerSagas(middleware: SagaMiddleware) {
  Object.values(sagas).forEach(saga => middleware.run(saga as any));
}
