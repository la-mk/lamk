import storageSaga from './sagas/storageSaga';
import { SagaMiddleware } from 'redux-saga';

const sagas = {
  ...storageSaga,
};

export default function registerSagas(middleware: SagaMiddleware) {
  Object.values(sagas).forEach(saga => middleware.run(saga as any));
}
