const getActionWithSuffix = (suffix: string) => (actionType: string) =>
  actionType + suffix;

export const prepare = getActionWithSuffix('_PREPARE');
export const processing = getActionWithSuffix('_PROCESSING');
export const success = getActionWithSuffix('_SUCCESS');
export const error = getActionWithSuffix('_ERROR');
export const abort = getActionWithSuffix('_ABORT');
