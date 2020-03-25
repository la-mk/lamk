import * as crypto from 'crypto';

// For whatever reason fields in error responses are an array of the duplicated element, so we need a getter to abstract that.
export const getField = (fieldName: string, data: any) => {
  const val = data[fieldName];
  return Array.isArray(val) ? val[0] : val;
};

export const getHashFromResponse = (clientKey: string, data: any) => {
  const { HASHPARAMS: hashParams } = data;
  if (!hashParams) {
    return null;
  }

  // We need to also check that hashParamsVal is valid according to the documentation.
  const params: string[] = hashParams.split(':');
  const paramsVal = params.map(param => getField(param, data)).join('');

  // The hash that comes from the caller has the secret client key appended, which is the only thing that guarantees the source of the transaction.
  const hashData = paramsVal + clientKey;
  const hash = crypto
    .createHash('sha1')
    .update(hashData)
    .digest('base64');

  return { hash, paramsVal };
};

export const hashValidator = (clientKey: string, data: any) => {
  const { HASHPARAMSVAL: hashParamsVal, HASH: hash } = data;
  const localHash = getHashFromResponse(clientKey, data);

  if (!localHash?.hash || !localHash?.paramsVal || !hashParamsVal || !hash) {
    return false;
  }

  if (localHash.paramsVal !== hashParamsVal) {
    return false;
  }

  return hash === localHash.hash;
};
