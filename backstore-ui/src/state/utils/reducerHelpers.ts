import { fetching, success, error, abort } from './actionHelpers';
import camelCase from 'lodash/camelCase';

export function getNewCursor(initialActionState: any, newState: any) {
  let changedCursor = {};
  //Only the after cursor should change as after data is required for.
  if (initialActionState.after && newState.after) {
    changedCursor = {
      afterReward: newState.after,
      hasAfterReward: newState.hasAfter,
    };
  } else if (initialActionState.before && newState.before) {
    changedCursor = {
      beforeReward: newState.before,
      hasBeforeReward: newState.hasBefore,
    };
  } else if (newState.before && newState.after) {
    //It is an initial fetch, so set the initial cursors.
    changedCursor = {
      afterReward: newState.after,
      hasAfterReward: newState.hasAfter,
      beforeReward: newState.before,
      hasBeforeReward: newState.hasBefore,
    };
  }

  return changedCursor;
}

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
  dataHanlder: any,
  errorHandler?: any,
) {
  switch (action.type) {
    case fetching(actionName): {
      return {
        ...state,
        [`isFetching${capitalizedMethodName}`]: true,
        [`error${capitalizedMethodName}`]: undefined,
        [`isAborted${capitalizedMethodName}`]: false,
      };
    }

    case success(actionName): {
      return {
        ...state,
        [`isFetching${capitalizedMethodName}`]: false,
        [`error${capitalizedMethodName}`]: undefined,
        [`isAborted${capitalizedMethodName}`]: false,
        ...(dataHanlder
          ? dataHanlder(action.data, state, action.initialAction)
          : {}),
      };
    }

    case error(actionName): {
      return {
        ...state,
        [`isFetching${capitalizedMethodName}`]: false,
        [`error${capitalizedMethodName}`]: action.errorMessage,
        [`isAborted${capitalizedMethodName}`]: false,
        ...(errorHandler
          ? errorHandler(action.error, state, action.initialAction)
          : {}),
      };
    }

    case abort(actionName): {
      return {
        ...state,
        [`isFetching${capitalizedMethodName}`]: false,
        [`error${capitalizedMethodName}`]: undefined,
        [`isAborted${capitalizedMethodName}`]: true,
      };
    }

    default:
      return state;
  }
}
