import { processing, success, error, abort } from './actionHelpers';
import camelCase from 'lodash/camelCase';

export function standardUpdateReducer(
  actionName: string,
  dataHanlder: any,
  errorHandler?: any,
) {
  const normalizedActionName = actionName.slice(actionName.indexOf('/'));
  const camelCaseActionName = camelCase(normalizedActionName);
  const capitalizedMethodName = camelCaseActionName.slice(
    camelCaseActionName.indexOf('update') + 6,
  );

  return (state: any, action: any) =>
    reducerHandler(
      state,
      action,
      actionName,
      capitalizedMethodName,
      dataHanlder,
      errorHandler,
    );
}

export function standardFetchReducer(
  actionName: any,
  dataHanlder: any,
  errorHandler?: any,
) {
  const normalizedActionName = actionName.slice(actionName.indexOf('/'));
  const camelCaseActionName = camelCase(normalizedActionName);
  const capitalizedMethodName = camelCaseActionName.slice(
    camelCaseActionName.indexOf('fetch') + 5,
  );

  return (state: any, action: any) =>
    reducerHandler(
      state,
      action,
      actionName,
      capitalizedMethodName,
      dataHanlder,
      errorHandler,
    );
}

function reducerHandler(
  state = {},
  action: any,
  actionName: string,
  capitalizedMethodName: string,
  dataHanlder?: any,
  errorHandler?: any,
) {
  switch (action.type) {
    case processing(actionName): {
      return {
        ...state,
        [`processing${capitalizedMethodName}`]: true,
        [`error${capitalizedMethodName}`]: undefined,
        [`aborted${capitalizedMethodName}`]: false,
      };
    }

    case success(actionName): {
      return {
        ...state,
        [`processing${capitalizedMethodName}`]: false,
        [`error${capitalizedMethodName}`]: undefined,
        [`aborted${capitalizedMethodName}`]: false,
        ...(dataHanlder
          ? dataHanlder(action.data, state, action.initialAction)
          : { data: action.data }),
      };
    }

    case error(actionName): {
      return {
        ...state,
        [`processing${capitalizedMethodName}`]: false,
        [`error${capitalizedMethodName}`]: action.errorMessage,
        [`aborted${capitalizedMethodName}`]: false,
        ...(errorHandler
          ? errorHandler(action.error, state, action.initialAction)
          : {}),
      };
    }

    case abort(actionName): {
      return {
        ...state,
        [`processing${capitalizedMethodName}`]: false,
        [`error${capitalizedMethodName}`]: undefined,
        [`aborted${capitalizedMethodName}`]: true,
      };
    }

    default:
      return state;
  }
}
