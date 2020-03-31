import React, { useState, useEffect } from 'react';
import { Page } from '../shared/Page';
import { useTranslation } from '../../common/i18n';
import { useSelector } from 'react-redux';
import { PaymentForm } from '../payments/PaymentForm';
import {
  Flex,
  Spin,
  hooks,
  Alert,
  Title,
  Button,
  Text,
  Result,
} from '@sradevski/blocks-ui';
import { Order } from '@sradevski/la-sdk/dist/models/order';
import { sdk } from '@sradevski/la-sdk';
import { getUser } from '../../state/modules/user/user.selector';
import { FrameMessageExchange } from '../shared/FrameMessageExchange';
import { Success } from '../cart/Success';
import { getStore } from '../../state/modules/store/store.selector';
import { StorePaymentMethods } from '@sradevski/la-sdk/dist/models/storePaymentMethods';
import Link from 'next/link';

interface PaymentProps {
  orderId: string | undefined;
}

export const Payment = ({ orderId }: PaymentProps) => {
  const { t } = useTranslation();
  const [isLoadingPayment, setIsLoadingPayment] = useState(true);
  const user = useSelector(getUser);
  const store = useSelector(getStore);
  const [order, setOrder] = useState<Order | null>(null);
  const [caller, showSpinner] = hooks.useCall();
  const [
    storePaymentMethods,
    setStorePaymentMethods,
  ] = useState<StorePaymentMethods | null>(null);
  const [paymentResponse, setPaymentResponse] = useState(null);
  const isBrowser = typeof window !== 'undefined';

  useEffect(() => {
    if (!user || !store) {
      return;
    }

    caller(sdk.order.get(orderId), setOrder);
    caller(sdk.storePaymentMethods.findForStore(store._id), res =>
      setStorePaymentMethods(res.data[0]),
    );
  }, [user, store, caller]);

  const cardPaymentInfo = storePaymentMethods?.methods.find(
    method =>
      method.name === sdk.storePaymentMethods.PaymentMethodNames.CREDIT_CARD,
  );

  if (!cardPaymentInfo && !showSpinner) {
    return <div>{t('payment.storeNoCardSupport')}</div>;
  }

  if (!order && !showSpinner) {
    return <div>{t('order.orderNotFoundTip')}</div>;
  }

  if (order && order.status !== sdk.order.OrderStatus.PENDING_PAYMENT) {
    return (
      <Result
        status='warning'
        title={t('payment.paymentDisabled')}
        subTitle={t('order.orderAlreadyPaid')}
        extra={
          <Link
            passHref
            replace
            href='/orders/[pid]'
            as={`/orders/${order._id}`}
          >
            <Button mt={2} mx={2} type='primary' key='console'>
              {t('order.seeOrder')}
            </Button>
          </Link>
        }
      />
    );
  }

  const frameName = 'paymentFrame';
  const transaction = paymentResponse?.data?.transactions?.[0];
  const transactionStatus = transaction?.status;

  const shouldRetry =
    !!paymentResponse?.error ||
    transactionStatus === sdk.orderPayments.TransactionStatus.DECLINED ||
    transactionStatus === sdk.orderPayments.TransactionStatus.ERROR;

  if (transactionStatus === sdk.orderPayments.TransactionStatus.APPROVED) {
    return <Success order={order} />;
  }

  return (
    <Page title={t('pages.payment')}>
      <Spin
        spinning={
          showSpinner || !order || (isLoadingPayment && !paymentResponse)
        }
      >
        <Flex
          alignItems='center'
          justifyContent='center'
          flexDirection='column'
        >
          {order && (
            <Title type='secondary' level={3}>
              {t('payment.payAmountTip', {
                amountWithCurrency: `${order.calculatedTotal} ден`,
              })}
            </Title>
          )}
          {paymentResponse?.error && (
            <Alert
              mt={3}
              type='error'
              message={
                paymentResponse.error?.message ?? t('results.genericError')
              }
            />
          )}

          {(transactionStatus ===
            sdk.orderPayments.TransactionStatus.DECLINED ||
            transactionStatus ===
              sdk.orderPayments.TransactionStatus.ERROR) && (
            <Alert
              mt={3}
              type='error'
              message={transaction?.message ?? t('results.genericError')}
            />
          )}

          {shouldRetry && (
            <>
              <Button
                mt={4}
                size='large'
                type='primary'
                onClick={() => {
                  setPaymentResponse(null);
                  setIsLoadingPayment(true);
                }}
              >
                {t('actions.retry')}
              </Button>
              <Text mt={2} type='secondary'>
                {t('order.retryFromOrdersTip')}
              </Text>
            </>
          )}

          {isBrowser && order && storePaymentMethods && !paymentResponse && (
            <>
              <PaymentForm
                target={frameName}
                storePaymentsId={storePaymentMethods._id}
                cardPaymentInfo={cardPaymentInfo}
                order={order}
              />
              {/* Can hide a spinner after the iframe is loaded */}
              <FrameMessageExchange
                frameName={frameName}
                onLoad={() => setIsLoadingPayment(false)}
                onResponse={setPaymentResponse}
              />
            </>
          )}
        </Flex>
      </Spin>
    </Page>
  );
};
