export const pickDiff = (oldObj: any, newObj: any) => {
  return Object.keys(newObj).reduce((diff: any, newKey) => {
    if (oldObj[newKey] !== newObj[newKey]) {
      diff[newKey] = newObj[newKey];
    }

    return diff;
  }, {});
};
