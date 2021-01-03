import React, { useState, useEffect } from 'react';
import { Page } from '../../shared/Page';
import { useTranslation } from '../../../common/i18n';
import { useSelector, useDispatch } from 'react-redux';
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
} from '@sradevski/blocks-ui';
import { Order } from '@sradevski/la-sdk/dist/models/order';
import { sdk } from '@sradevski/la-sdk';
import { getUser } from '../../../state/modules/user/user.selector';
import { FrameMessageExchange } from '../../shared/FrameMessageExchange';
import { Success } from '../../cart/Success';
import { getStore } from '../../../state/modules/store/store.selector';
import { StorePaymentMethods } from '@sradevski/la-sdk/dist/models/storePaymentMethods';
import Link from 'next/link';
import { trackEvent } from '../../../state/modules/analytics/analytics.actions';
import { AnalyticsEvents } from '@sradevski/analytics';
import { useBreadcrumb } from '../../shared/hooks/useBreadcrumb';

interface PaymentProps {
  orderId: string | undefined;
}

export const Payment = ({ orderId }: PaymentProps) => {
  const { t } = useTranslation();
  const user = useSelector(getUser);
  const store = useSelector(getStore);
  const dispatch = useDispatch();
  const [orderCaller, showOrderSpinner] = hooks.useCall(true);
  const [paymentMethodCaller, showPaymentMethodSpinner] = hooks.useCall(true);
  const [trackedEvent, setTrackedEvent] = useState(false);
  const [isLoadingPayment, setIsLoadingPayment] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
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
      url: `/account/orders/${orderId}`,
      title: t('pages.order'),
    },
    {
      urlPattern: '/account/orders/[oid]/pay',
      url: `/account/orders/${orderId}/pay`,
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
    if (!user || !store) {
      return;
    }

    orderCaller(sdk.order.get(orderId), setOrder);
  }, [user, store, orderCaller]);

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

  if (!order && !showOrderSpinner) {
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
          !showPaymentMethodSpinner && !showOrderSpinner && !isLoadingPayment
        }
      >
        <Flex align='center' justify='center' direction='column'>
          {order && (
            <Heading as='h3' size='lg' mb={3}>
              {t('payment.payAmountTip', {
                amountWithCurrency: `${order.calculatedTotal} ден`,
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
