import axios from 'axios';
import { call, takeEvery, put, cancelled } from 'redux-saga/effects';

import { isCached, getCache, setCache } from '../utils/cache';
import {
  prepare,
  fetching,
  success,
  error,
  abort,
} from '../utils/actionHelpers';
import { objectToQueryString } from '../utils/querystring';

function isFetchAction(action: any) {
  return Boolean(action.request);
}

function getCancellationToken() {
  return axios.CancelToken.source();
}

function makeRequest(request: any) {
  return axios(request);
}

function abortRequest(cancelToken: any) {
  if (cancelToken) {
    cancelToken.cancel();
  }
}

function injectAuthToken(request: any) {
  if (!request.headers) {
    request.headers = {};
  }

  //TODO: Specify the right location, or even better, make saga accept it as a param.
  const token = localStorage.getItem('token');
  if (token) {
    request.headers['Authorization'] = `Bearer ${token}`;
  }
}

const genericErrorMessage =
  'An error occured while trying to fetch data from network.';

function getErrorResponse(err: any, actionType: string, initialAction: any) {
  if (err.response) {
    //Request made, error outside HTTP 2xx was returned.
    return {
      initialAction,
      errorMessage: err.response.data.message || genericErrorMessage,
      err: err.response.data,
      type: error(actionType),
    };
  } else if (err.request) {
    //Request was made, but no response was received.
    return {
      initialAction,
      errorMessage: genericErrorMessage,
      type: error(actionType),
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      initialAction,
      errorMessage: err.message || genericErrorMessage,
      type: error(actionType),
    };
  }
}

function populateRequest(request: any, authorize: boolean) {
  let cancelToken = getCancellationToken();
  request.cancelToken = cancelToken.token;

  if (authorize) {
    injectAuthToken(request);
  }

  if (request.queryParams) {
    const stringifiedParams = objectToQueryString(request.queryParams);
    request.url = `${request.url}${stringifiedParams}`;
  }

  request.timeout = request.timeout || 20000;

  return cancelToken;
}

function* getFromCache(request: any, action: any) {
  try {
    const cacheVal = getCache(request.url);
    yield put({
      initialAction: action,
      data: cacheVal ? cacheVal.data : null,
      type: success(action.type),
    });
  } catch (err) {
    yield put(
      getErrorResponse(
        { message: 'An error occured while retrieving data from cache.' },
        action.type,
        action,
      ),
    );
  }
}

function* getFromNetwork(
  request: any,
  action: any,
  transform: any,
  ttl: number,
) {
  try {
    yield put({ initialAction: action, type: fetching(action.type) });

    const networkResult = yield call(makeRequest, request);
    let data = networkResult.data;

    if (transform && transform instanceof Function) {
      data = transform(networkResult.data);
    }

    if (request.method.toUpperCase() === 'GET') {
      setCache(request.url, data, ttl);
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

function* fetchSaga(action: any) {
  const { request, forceFetch, ttl, authorize, transform } = action;
  let cancelToken;

  try {
    yield put({ initialAction: action, type: prepare(action.type) });
    cancelToken = populateRequest(request, authorize);

    if (
      !forceFetch &&
      request.method.toUpperCase() === 'GET' &&
      isCached(request.url)
    ) {
      yield call(getFromCache, request, action);
    } else {
      yield call(getFromNetwork, request, action, transform, ttl);
    }
  } catch (err) {
    yield put(getErrorResponse(err, action.type, action));
  } finally {
    if (yield cancelled()) {
      yield call(abortRequest, cancelToken);
      yield put({
        initialAction: action,
        type: abort(action.type),
      });
    }
  }
}

export function* watchFetchSaga() {
  yield takeEvery(isFetchAction, fetchSaga);
}

export default { watchFetchSaga };
