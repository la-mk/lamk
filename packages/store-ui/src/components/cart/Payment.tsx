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
} from '@sradevski/blocks-ui';
import { Order } from '@sradevski/la-sdk/dist/models/order';
import { sdk } from '@sradevski/la-sdk';
import { getUser } from '../../state/modules/user/user.selector';
import { FrameMessageExchange } from '../shared/FrameMessageExchange';
import { Success } from './Success';

interface PaymentProps {
  orderId: string | undefined;
}

export const Payment = ({ orderId }: PaymentProps) => {
  const { t } = useTranslation();
  const [isLoadingPayment, setIsLoadingPayment] = useState(true);
  const user = useSelector(getUser);
  const [order, setOrder] = useState<Order | null>(null);
  const [caller, fetchingOrder] = hooks.useCall();
  const [paymentResponse, setPaymentResponse] = useState(null);
  const isBrowser = typeof window !== 'undefined';

  useEffect(() => {
    if (!user) {
      return;
    }

    caller(sdk.order.get(orderId), setOrder);
  }, [user, caller]);

  if (!order && !fetchingOrder) {
    return (
      <div>
        We cannot find the order you are looking for, make sure you are logged
        in and try again.
      </div>
    );
  }

  if (order && order.status !== sdk.order.OrderStatus.PENDING_PAYMENT) {
    return (
      <div>
        It seems this order is either paid for, or the payment will happen on
        delivery
      </div>
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
      <Spin spinning={fetchingOrder || (isLoadingPayment && !paymentResponse)}>
        <Flex
          alignItems='center'
          justifyContent='center'
          flexDirection='column'
        >
          <Title type='secondary' level={3}>
            All we need to do is pay now.
          </Title>
          {paymentResponse?.error && (
            <Alert
              mt={3}
              type='error'
              message={paymentResponse.error?.message ?? 'An error occured'}
            />
          )}

          {(transactionStatus ===
            sdk.orderPayments.TransactionStatus.DECLINED ||
            transactionStatus ===
              sdk.orderPayments.TransactionStatus.ERROR) && (
            <Alert
              mt={3}
              type='error'
              message={transaction?.message ?? 'An error occured'}
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
                Retry
              </Button>
              <Text mt={2} type='secondary'>
                You can also retry later from the "Orders" page
              </Text>
            </>
          )}

          {isBrowser && order && !paymentResponse && (
            <>
              <PaymentForm
                target={frameName}
                storePaymentInfo={{
                  clientId: '180000063',
                  storeKey: 'SKEY0063',
                }}
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
