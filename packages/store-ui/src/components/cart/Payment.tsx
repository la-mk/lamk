import React, { useState, useEffect } from 'react';
import { Page } from '../shared/Page';
import { useTranslation } from '../../common/i18n';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { PaymentForm } from '../payments/PaymentForm';
import { Flex, Spin, hooks } from '@sradevski/blocks-ui';
import { Order } from '@sradevski/la-sdk/dist/models/order';
import { sdk } from '@sradevski/la-sdk';
import { getUser } from '../../state/modules/user/user.selector';

const PaymentIframe = styled.iframe`
  border: 0;
  padding: 0;
  margin: 0;
  height: 600px;
  width: 800px;
`;

interface PaymentProps {
  orderId: string | undefined;
}

export const Payment = ({ orderId }: PaymentProps) => {
  const { t } = useTranslation();
  const [isLoadingPayment, setIsLoadingPayment] = useState(true);
  const user = useSelector(getUser);
  const [order, setOrder] = useState<Order | null>(null);
  const [caller, fetchingOrder] = hooks.useCall();

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

  return (
    <Page title={t('pages.checkout')}>
      <Spin spinning={fetchingOrder || isLoadingPayment}>
        {order && (
          <>
            <PaymentForm
              target='paymentFrame'
              storePaymentInfo={{
                clientId: '180000063',
                storeKey: 'SKEY0063',
              }}
              order={order}
            />
            <Flex alignItems='center' justifyContent='center'>
              <PaymentIframe
                name='paymentFrame'
                // Can hide a spinner after the iframe is loaded
                onLoad={() => setIsLoadingPayment(false)}
              />
            </Flex>
          </>
        )}
      </Spin>
    </Page>
  );
};
