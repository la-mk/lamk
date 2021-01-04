import React from 'react';
import { NestPay } from './NestPay';
import { useTranslation } from '../../common/i18n';
import { Order } from '@la-mk/la-sdk/dist/models/order';
import { sdk } from '@la-mk/la-sdk';
import { PaymentMethod } from '@la-mk/la-sdk/dist/models/storePaymentMethods';

//ISO 4217 currency code for Denar
const DENAR_CURRENCY_ID = 807;
const TRANSACTION_TYPE = 'Auth';

interface PaymentFormProps {
  target: string;
  order: Order;
  storePaymentsId: string;
  cardPaymentInfo: Pick<PaymentMethod, 'clientId' | 'processor'>;
}

export const PaymentForm = ({
  target,
  order,
  storePaymentsId,
  cardPaymentInfo,
}: PaymentFormProps) => {
  const { i18n } = useTranslation();
  const orderTotal = sdk.utils.pricing.calculatePrices(
    order.ordered,
    order.delivery,
    order.campaigns,
  );

  // If rendered on the service, it's fine for this to be an empty string.
  const paymentCallback = window
    ? `${window.location.protocol}//${window.location.hostname}/api/paymentResponse`
    : '';

  return (
    <NestPay
      target={target}
      storePaymentsId={storePaymentsId}
      data={{
        clientId: cardPaymentInfo.clientId,
        orderId: order._id,
        orderTotal: orderTotal.total,
        currencyCode: DENAR_CURRENCY_ID,
        transactionType: TRANSACTION_TYPE,
        language: i18n.language,
        // We have to make the request to a sameorigin URL, otherwise it won't display it in the iframe.
        okUrl: paymentCallback,
        failUrl: paymentCallback,
      }}
    />
  );
};
