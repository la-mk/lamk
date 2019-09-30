export function objectToQueryString(obj: any) {
  return Object.keys(obj)
    .filter(key => obj[key] !== null || obj[key] !== undefined)
    .reduce((str, key, i) => {
      const delimiter = i === 0 ? '?' : '&';
      const encodedKey = encodeURIComponent(key);
      const encodedVal = encodeURIComponent(obj[key]);
      return [str, delimiter, encodedKey, '=', encodedVal].join('');
    }, '');
}
