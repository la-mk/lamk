import isObject from 'lodash/isObject';

export const getShortId = (
  idOrItem: string | { _id: string; [key: string]: any },
): string => {
  let id = idOrItem;
  if (isObject(idOrItem)) {
    id = idOrItem._id;
  }

  return id.substring(0, 8);
};
