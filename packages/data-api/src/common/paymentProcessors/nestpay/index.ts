import * as crypto from 'crypto';
import * as xml from 'xml2js';
import { PaymentMethod } from '@la-mk/la-sdk/dist/models/storePaymentMethods';
import { PaymentTransaction } from '@la-mk/la-sdk/dist/models/orderPayments';
import { sdk } from '@la-mk/la-sdk';
import env from '../../env';

const xmlBuilder = new xml.Builder({
  xmldec: { version: '1.0', encoding: 'ISO-8859-9' },
});

export const PROCESSOR_URL = env().NESTPAY_API_ENDPOINT;

// For whatever reason fields in error responses are an array of the duplicated element, so we need a getter to abstract that.
export const getField = (fieldName: string, data: any) => {
  const val = data[fieldName];
  return {
    fieldName: fieldName.toLowerCase(),
    value: Array.isArray(val) ? val[0] : val,
  };
};

export const calculateHash = (clientKey: string, paramsVal: string) => {
  const hashData = paramsVal + '|' + clientKey;
  const hash = crypto.createHash('sha512').update(hashData).digest('base64');

  return hash;
};

export const getHashFromResponse = (clientKey: string, data: any) => {
  const { HASHPARAMS: hashParams } = data;
  if (!hashParams) {
    return null;
  }

  // We need to also check that hashParamsVal is valid according to the documentation.
  const params: string[] = hashParams.split('|');
  const paramsVal = params
    .map(param => getField(param, data))
    .sort((a, b) => a.fieldName.localeCompare(b.fieldName))
    .map(param => param.value)
    .join('|');

  // The hash that comes from the caller has the secret client key appended, which is the only thing that guarantees the source of the transaction.
  const hash = calculateHash(clientKey, paramsVal);
  return { hash, paramsVal };
};

export const hashValidator = (clientKey: string, data: any) => {
  console.log(JSON.stringify(data, null, 2));
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

export const getStatus = (data: {
  Response: 'Approved' | 'Declined' | 'Error';
}) => {
  const resp = getField('Response', data).value;
  switch (resp) {
    case 'Approved':
      return sdk.orderPayments.TransactionStatus.APPROVED;
    case 'Declined':
      return sdk.orderPayments.TransactionStatus.DECLINED;
    default:
      return sdk.orderPayments.TransactionStatus.ERROR;
  }
};

export const getStatusQueryRequest = (
  orderId: string,
  creditCardInfo: PaymentMethod,
) => {
  const obj = {
    CC5Request: {
      Name: creditCardInfo.clientUsername,
      Password: creditCardInfo.clientPassword,
      ClientId: creditCardInfo.clientId,
      OrderId: orderId,
      Extra: {
        ORDERHISTORY: 'QUERY',
      },
    },
  };

  return xmlBuilder.buildObject(obj);
};

export const parseStatusQueryResponse = async (
  resp: any,
): Promise<PaymentTransaction[]> => {
  const parsedResponse = (await xml.parseStringPromise(resp))?.CC5Response;
  const transactions = parsedResponse?.Extra;
  console.log(transactions);

  const formattedResponse: PaymentTransaction = {
    status: getStatus(parsedResponse),
    amount: 12345,
    currency: 'mkd',
    message: getField('ErrMsg', parsedResponse).value,
    processorId: parsedResponse.TransId,
    date: '23456',
  };

  return [formattedResponse];
};
