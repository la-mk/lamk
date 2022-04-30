import React, { useState, useEffect } from 'react';
import { Page } from '../../layout/Page';
import { useTranslation } from '../../../common/i18n';
import { useDispatch } from 'react-redux';
import { PaymentForm } from '../../payments/PaymentForm';
import {
  Flex,
  Spinner,
  hooks,
  Alert,
  Heading,
  Button,
  Text,
  Result,
} from '@la-mk/blocks-ui';
import { sdk } from '@la-mk/la-sdk';
import { FrameMessageExchange } from '../../shared/FrameMessageExchange';
import { Success } from '../../cart/Success';
import { StorePaymentMethods } from '@la-mk/la-sdk/dist/models/storePaymentMethods';
import Link from 'next/link';
import { trackEvent } from '../../../state/modules/analytics/analytics.module';
import { AnalyticsEvents } from '@la-mk/analytics';
import { useBreadcrumb } from '../../shared/hooks/useBreadcrumb';
import { User } from '../../../domain/user';
import { Store } from '../../../domain/store';
import { Order } from '../../../domain/order';

interface PaymentProps {
  user: User;
  store: Store;
  order: Order;
  isLoadingOrder: boolean;
}

export const Payment = ({
  user,
  store,
  order,
  isLoadingOrder,
}: PaymentProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [paymentMethodCaller, showPaymentMethodSpinner] = hooks.useCall(true);
  const [trackedEvent, setTrackedEvent] = useState(false);
  const [isLoadingPayment, setIsLoadingPayment] = useState(true);
  const [
    storePaymentMethods,
    setStorePaymentMethods,
  ] = useState<StorePaymentMethods | null>(null);
  const [paymentResponse, setPaymentResponse] = useState(null);
  const isBrowser = typeof window !== 'undefined';

  const transaction = paymentResponse?.data?.transactions?.[0];
  const transactionStatus = transaction?.status;

  const shouldRetry =
    !!paymentResponse?.error ||
    transactionStatus === sdk.orderPayments.TransactionStatus.DECLINED ||
    transactionStatus === sdk.orderPayments.TransactionStatus.ERROR;

  const cardPaymentInfo = storePaymentMethods?.methods.find(
    method =>
      method.name === sdk.storePaymentMethods.PaymentMethodNames.CREDIT_CARD,
  );

  useBreadcrumb([
    { url: '/', title: t('pages.home') },
    { url: '/account/orders', title: t('pages.order_plural') },
    {
      urlPattern: '/account/orders/[oid]',
      url: `/account/orders/${order?._id}`,
      title: t('pages.order'),
    },
    {
      urlPattern: '/account/orders/[oid]/pay',
      url: `/account/orders/${order?._id}/pay`,
      title: t('pages.payment'),
    },
  ]);

  useEffect(() => {
    if (!order || !transactionStatus || !cardPaymentInfo || trackedEvent) {
      return;
    }

    dispatch(
      trackEvent({
        eventName: AnalyticsEvents.pay,
        orderId: order._id,
        totalPrice: order.calculatedTotal,
        status: transactionStatus,
        processor: cardPaymentInfo.processor,
      }),
    );

    setTrackedEvent(true);
  }, [order, transactionStatus, cardPaymentInfo, trackedEvent]);

  useEffect(() => {
    if (!store) {
      return;
    }

    paymentMethodCaller(sdk.storePaymentMethods.findForStore(store._id), res =>
      setStorePaymentMethods(res.data[0]),
    );
  }, [store, paymentMethodCaller]);

  if (!cardPaymentInfo && !showPaymentMethodSpinner) {
    return (
      <Result
        mt={8}
        status='warning'
        title={t('payment.paymentDisabled')}
        description={t('payment.storeNoCardSupport')}
      />
    );
  }

  if (!order && !isLoadingOrder) {
    return (
      <Result
        mt={8}
        status='warning'
        title={t('order.orderNotFound')}
        description={t('order.orderNotFoundTip')}
      />
    );
  }

  if (order && order.status !== sdk.order.OrderStatus.PENDING_PAYMENT) {
    return (
      <Flex
        mx='auto'
        maxWidth={'24rem'}
        mt={8}
        direction='column'
        justify='center'
      >
        <Result
          status='warning'
          title={t('payment.paymentDisabled')}
          description={t('order.orderAlreadyPaid')}
        />
        <Link
          passHref
          replace
          href='/account/orders/[pid]'
          as={`/account/orders/${order._id}`}
        >
          <Button mt={5} as='a' mx={2} key='console'>
            {t('order.seeOrder')}
          </Button>
        </Link>
      </Flex>
    );
  }

  if (transactionStatus === sdk.orderPayments.TransactionStatus.APPROVED) {
    return <Success mt={[7, 8, 8]} order={order} />;
  }

  const frameName = 'paymentFrame';

  return (
    <Page>
      <Spinner
        isLoaded={
          !showPaymentMethodSpinner && !isLoadingOrder && !isLoadingPayment
        }
      >
        <Flex align='center' justify='center' direction='column'>
          {order && (
            <Heading as='h3' size='lg' mb={3}>
              {t('payment.payAmountTip', {
                amountWithCurrency: `${order.calculatedTotal} ${t(
                  `currencies.${order.currency}`,
                )}`,
              })}
            </Heading>
          )}
          {paymentResponse?.error && (
            <Alert
              maxWidth={'40rem'}
              mt={5}
              status='error'
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
              maxWidth={'40rem'}
              mt={5}
              status='error'
              message={transaction?.message ?? t('results.genericError')}
            />
          )}

          {shouldRetry && (
            <>
              <Button
                mt={6}
                size='lg'
                onClick={() => {
                  setPaymentResponse(null);
                  setIsLoadingPayment(true);
                }}
              >
                {t('actions.retry')}
              </Button>
              <Text mt={3} color='mutedText.dark'>
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
      </Spinner>
    </Page>
  );
};
