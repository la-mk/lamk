import React, { useState, useEffect } from 'react';
import {
  Flex,
  Steps,
  Step,
  Result,
  Spinner,
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
import {
  getSubtitleForSet,
  getTitleForSet,
  useTranslation,
} from '../../common/i18n';
import { getStore } from '../../state/modules/store/store.selector';
import { goTo } from '../../state/modules/navigation/navigation.actions';
import { useBreadcrumb } from '../shared/hooks/useBreadcrumb';
import { CustomCard } from '../shared/components/CustomCard';
import { OrderDescription } from './OrderDescription';
import { ManagedSets } from '../sets/ManagedSets';

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
    case sdk.order.OrderStatus.INVALID:
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

  useBreadcrumb([
    { url: '/', title: t('pages.home') },
    { url: '/orders', title: t('pages.order_plural') },
    {
      urlPattern: '/orders/[oid]',
      url: `/orders/${orderId}`,
      title: `${t('pages.order')} - ${sdk.utils.getShortId(orderId)}`,
    },
  ]);

  useEffect(() => {
    if (orderId && user) {
      caller(sdk.order.get(orderId), setOrder);
    }
  }, [caller, user, orderId]);

  if (!order) {
    return (
      <Result status='empty' mt={7} description={t('order.orderNotFound')} />
    );
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
    <Page>
      <Spinner isLoaded={!showSpinner}>
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
          {status !== sdk.order.OrderStatus.CANCELLED &&
            status !== sdk.order.OrderStatus.INVALID && (
              <Step
                title={t('orderStatus.completed')}
                description={t('orderStatus.completedDescription')}
              />
            )}
          {status === sdk.order.OrderStatus.CANCELLED && (
            <Step
              status='error'
              title={t('orderStatus.cancelled')}
              description={t('orderStatus.cancelledDescription')}
            />
          )}
          {status === sdk.order.OrderStatus.INVALID && (
            <Step
              status='error'
              title={t('orderStatus.invalid')}
              description={t('orderStatus.invalidDescription')}
            />
          )}
        </Steps>

        <Flex
          mt={4}
          width='100%'
          justify='space-between'
          align={['center', 'center', 'flex-start']}
          direction={['column-reverse', 'column-reverse', 'row']}
        >
          <Flex maxWidth={960} flex={1} direction='column' mr={[0, 0, 3]}>
            <CustomCard mb={3}>
              <OrderDescription
                hideDetailsButton
                order={order}
                storeId={store._id}
              />
            </CustomCard>
            {order.deliverTo && (
              <CustomCard minWidth={320} mt={3}>
                <ShippingDescription address={order.deliverTo} />
              </CustomCard>
            )}
          </Flex>
          <Flex
            align='flex-start'
            justify='center'
            maxWidth={[0, 0, 460]}
            flex={1}
            ml={[0, 0, 3]}
            my={[4, 4, 0]}
          >
            <Summary
              hideFreeShipping
              items={order.ordered}
              delivery={order.delivery}
              campaigns={order.campaigns ?? []}
              buttonTitle={shouldPay ? t('actions.toPayment') : undefined}
              onCheckout={shouldPay ? handlePayment : undefined}
              title={t('finance.priceBreakdown')}
            />
          </Flex>
        </Flex>

        <ManagedSets
          mt={7}
          storeId={store._id}
          setTags={[
            {
              title: t(
                getTitleForSet({ type: 'discounted', value: undefined }),
              ),
              subtitle: t(
                getSubtitleForSet({ type: 'discounted', value: undefined }),
              ),
              type: 'discounted',
              value: undefined,
              isPromoted: false,
            },
          ]}
        />
      </Spinner>
    </Page>
  );
};
