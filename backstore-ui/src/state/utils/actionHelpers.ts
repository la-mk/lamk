const getActionWithSuffix = (suffix: string) => (actionType: string) =>
  actionType + suffix;

export const prepare = getActionWithSuffix('_PREPARE');
export const fetching = getActionWithSuffix('_FETCHING');
export const success = getActionWithSuffix('_SUCCESS');
export const error = getActionWithSuffix('_ERROR');
export const abort = getActionWithSuffix('_ABORT');
