import React, { useState, useEffect } from 'react';
import {
  Title,
  Flex,
  Steps,
  Step,
  Card,
  Row,
  Col,
  Empty,
  Spin,
  hooks,
} from '@sradevski/blocks-ui';
import { Order as OrderType } from '@sradevski/la-sdk/dist/models/order';
import { ShippingDescription } from '../shared/ShippingDescription';
import { sdk } from '@sradevski/la-sdk';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Summary } from '../shared/Summary';
import { Page } from '../shared/Page';
import { getUser } from '../../state/modules/user/user.selector';
import { useTranslation } from '../../common/i18n';
import { OrderProductCard } from './OrderProductCard';
import { getStore } from '../../state/modules/store/store.selector';
import { goTo } from '../../state/modules/navigation/navigation.actions';

const getStepIndex = (status: OrderType['status'], isCardPayment: boolean) => {
  const startIndex = isCardPayment ? 1 : 0;

  switch (status) {
    case sdk.order.OrderStatus.PENDING_PAYMENT:
      return 0;
    case sdk.order.OrderStatus.PENDING_SHIPMENT:
      return startIndex;
    case sdk.order.OrderStatus.SHIPPED:
      return startIndex + 1;
    case sdk.order.OrderStatus.COMPLETED:
    case sdk.order.OrderStatus.CANCELLED:
      return startIndex + 2;
  }
};

export const Order = ({ orderId }: { orderId: string }) => {
  const [caller, showSpinner] = hooks.useCall();
  const store = useSelector(getStore);
  const user = useSelector(getUser);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [order, setOrder] = useState<OrderType>(null);

  useEffect(() => {
    if (orderId && user) {
      caller(sdk.order.get(orderId), setOrder);
    }
  }, [caller, user, orderId]);

  if (!order) {
    return <Empty mt={6} description={t('order.orderNotFound')}></Empty>;
  }

  const handlePayment = () => {
    dispatch(goTo(`/orders/${order._id}/pay`));
  };

  const isCardPayment =
    order.paymentMethod ===
    sdk.storePaymentMethods.PaymentMethodNames.CREDIT_CARD;

  const shouldPay =
    order.status === sdk.order.OrderStatus.PENDING_PAYMENT && isCardPayment;

  const status = order.status;
  const stepIndex = status ? getStepIndex(status, isCardPayment) : 0;

  return (
    <Page title={t('pages.order')}>
      <Spin spinning={showSpinner}>
        <Steps size='small' current={stepIndex}>
          {isCardPayment && (
            <Step
              title={t('orderStatus.pendingPayment')}
              description={t('orderStatus.pendingPaymentDescription')}
            />
          )}
          <Step
            title={t('orderStatus.pendingShipment')}
            description={t('orderStatus.pendingShipmentDescription')}
          />
          <Step
            title={t('orderStatus.shipped')}
            description={t('orderStatus.shippedDescription')}
          />
          {status !== 'cancelled' && (
            <Step
              title={t('orderStatus.completed')}
              description={t('orderStatus.completedDescription')}
            />
          )}
          {status === 'cancelled' && (
            <Step
              status='error'
              title={t('orderStatus.cancelled')}
              description={t('orderStatus.cancelledDescription')}
            />
          )}
        </Steps>

        <Flex flexWrap='wrap' my={4} justifyContent='center'>
          <Card m={3} width={330} title={t('finance.priceBreakdown')}>
            <Summary
              items={order.ordered}
              delivery={order.delivery}
              campaigns={order.campaigns ?? []}
              buttonTitle={shouldPay ? t('actions.toPayment') : undefined}
              onCheckout={shouldPay ? handlePayment : undefined}
            />
          </Card>

          {order.deliverTo && (
            <Card m={3} width={330} title={t('address.shippingAddress')}>
              <ShippingDescription address={order.deliverTo} />
            </Card>
          )}
        </Flex>
        <Title mb={3} level={3}>
          {t('product.product_plural')}
        </Title>
        <Row
          align='top'
          justify='start'
          gutter={{ xs: 16, sm: 24, md: 32, lg: 64 }}
        >
          {order.ordered.map(orderItem => {
            return (
              <Col
                width={['100%', '330px', '330px']}
                key={orderItem.product._id}
                mb={4}
              >
                <OrderProductCard orderItem={orderItem} storeId={store._id} />
              </Col>
            );
          })}
        </Row>
      </Spin>
    </Page>
  );
};
