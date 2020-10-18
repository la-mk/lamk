// Converts a json pointer selector to array-split selector.
export const toArrayPath = (jsonPointer: string) =>
  jsonPointer ? jsonPointer.slice(1).split('/') : [];
