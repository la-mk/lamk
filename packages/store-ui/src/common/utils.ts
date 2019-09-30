// Picks the difference between the new and old object, useful when doing PATCH requests.
export const pickDiff = (oldObj: any, newObj: any) => {
  return Object.keys(newObj).reduce((diff, newKey) => {
    if (oldObj[newKey] !== newObj[newKey]) {
      diff[newKey] = newObj[newKey];
    }

    return diff;
  }, {});
};
