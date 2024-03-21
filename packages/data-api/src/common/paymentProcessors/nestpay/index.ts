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

const omitted = ['encoding', 'HASH', 'countdown', 'createdAt', '_id'];

export const getHashFromResponse = (clientKey: string, data: any) => {
  const params = Object.entries(data)
    .filter(([key]) => !omitted.includes(key))
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([_, val]) => val)
    .join('|');

  // The hash that comes from the caller has the secret client key appended, which is the only thing that guarantees the source of the transaction.
  const hash = calculateHash(clientKey, params);
  return { hash, paramsVal: params };
};

export const hashValidator = (clientKey: string, data: any) => {
  const serverHash = data.HASH;
  const localHash = getHashFromResponse(clientKey, data);

  if (!localHash?.hash || !serverHash) {
    return false;
  }

  return serverHash === localHash.hash;
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
