import { call, takeEvery, put, cancelled } from 'redux-saga/effects';

import {
  prepare,
  processing,
  success,
  error,
  abort,
} from '../utils/actionHelpers';

function isPromiseAction(action: any) {
  return Boolean(action.promise);
}

const genericErrorMessage =
  'An error occured while trying to fetch data from network.';

function getErrorResponse(err: any, actionType: string, initialAction: any) {
  return {
    initialAction,
    errorMessage: err.message || genericErrorMessage,
    error: err,
    type: error(actionType),
  };
}

function* resolvePromise(promise: any, action: any, transform: any) {
  try {
    yield put({ initialAction: action, type: processing(action.type) });
    let data = yield promise;
    if (transform && transform instanceof Function) {
      data = transform(data);
    }

    yield put({
      initialAction: action,
      data,
      type: success(action.type),
    });
  } catch (err) {
    yield put(getErrorResponse(err, action.type, action));
  }
}

function* promiseSaga(action: any) {
  const { promise, transform } = action;
  try {
    yield put({ initialAction: action, type: prepare(action.type) });
    yield call(resolvePromise, promise, action, transform);
  } catch (err) {
    yield put(getErrorResponse(err, action.type, action));
  } finally {
    if (yield cancelled()) {
      //TODO: Cancel request using AbortController
      yield put({
        initialAction: action,
        type: abort(action.type),
      });
    }
  }
}

export function* watchPromiseSaga() {
  yield takeEvery(isPromiseAction, promiseSaga);
}

export default { watchPromiseSaga };
