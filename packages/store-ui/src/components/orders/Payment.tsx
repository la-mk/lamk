import React, { useState, useEffect } from 'react';
import { Page } from '../shared/Page';
import { useTranslation } from '../../common/i18n';
import { useSelector, useDispatch } from 'react-redux';
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
import { trackEvent } from '../../state/modules/analytics/analytics.actions';
import { AnalyticsEvents } from '@sradevski/analytics';
import { useBreadcrumb } from '../shared/hooks/useBreadcrumb';

interface PaymentProps {
  orderId: string | undefined;
}

export const Payment = ({ orderId }: PaymentProps) => {
  const { t } = useTranslation();
  const [isLoadingPayment, setIsLoadingPayment] = useState(true);
  const user = useSelector(getUser);
  const store = useSelector(getStore);
  const [trackedEvent, setTrackedEvent] = useState(false);
  const dispatch = useDispatch();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderCaller, showOrderSpinner] = hooks.useCall(true);
  const [paymentMethodCaller, showPaymentMethodSpinner] = hooks.useCall(true);

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
    { url: '/orders', title: t('pages.order_plural') },
    {
      urlPattern: '/orders/[oid]',
      url: `/orders/${orderId}`,
      title: t('pages.order'),
    },
    {
      urlPattern: '/orders/[oid]/pay',
      url: `/orders/${orderId}/pay`,
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
        status='warning'
        title={t('payment.paymentDisabled')}
        subTitle={t('payment.storeNoCardSupport')}
      />
    );
  }

  if (!order && !showOrderSpinner) {
    return (
      <Result
        status='warning'
        title={t('order.orderNotFound')}
        subTitle={t('order.orderNotFoundTip')}
      />
    );
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
            <Button as='a' mt={2} mx={2} key='console'>
              {t('order.seeOrder')}
            </Button>
          </Link>
        }
      />
    );
  }

  const frameName = 'paymentFrame';

  if (transactionStatus === sdk.orderPayments.TransactionStatus.APPROVED) {
    return <Success mt={[5, 6, 6]} order={order} />;
  }

  return (
    <Page>
      <Spin
        spinning={
          showPaymentMethodSpinner ||
          showOrderSpinner ||
          (isLoadingPayment && !paymentResponse)
        }
      >
        <Flex
          alignItems='center'
          justifyContent='center'
          flexDirection='column'
        >
          {order && (
            <Title level={3} fontSize={4}>
              {t('payment.payAmountTip', {
                amountWithCurrency: `${order.calculatedTotal} ден`,
              })}
            </Title>
          )}
          {paymentResponse?.error && (
            <Alert
              mt={3}
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
              mt={3}
              status='error'
              message={transaction?.message ?? t('results.genericError')}
            />
          )}

          {shouldRetry && (
            <>
              <Button
                mt={4}
                size='lg'
                onClick={() => {
                  setPaymentResponse(null);
                  setIsLoadingPayment(true);
                }}
              >
                {t('actions.retry')}
              </Button>
              <Text mt={2} color='mutedText.dark'>
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
