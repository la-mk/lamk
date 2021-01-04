import React, { useState, useEffect } from 'react';
import { Flex, Steps, Result, Spinner, hooks } from '@la-mk/blocks-ui';
import { Order as OrderType } from '@la-mk/la-sdk/dist/models/order';
import { ShippingDescription } from '../../shared/ShippingDescription';
import { sdk } from '@la-mk/la-sdk';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Summary } from '../../shared/Summary';
import { Page } from '../../shared/Page';
import { getUser } from '../../../state/modules/user/user.selector';
import {
  getSubtitleForSet,
  getTitleForSet,
  useTranslation,
} from '../../../common/i18n';
import { getStore } from '../../../state/modules/store/store.selector';
import { goTo } from '../../../state/modules/navigation/navigation.actions';
import { useBreadcrumb } from '../../shared/hooks/useBreadcrumb';
import { CustomCard } from '../../shared/components/CustomCard';
import { OrderDescription } from './OrderDescription';
import { ManagedSets } from '../../sets/ManagedSets';
import { OrderSteps } from './OrderSteps';

export const Order = ({ orderId }: { orderId: string }) => {
  const [caller, showSpinner] = hooks.useCall();
  const store = useSelector(getStore);
  const user = useSelector(getUser);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [order, setOrder] = useState<OrderType>(null);

  useBreadcrumb([
    { url: '/', title: t('pages.home') },
    { url: '/account/orders', title: t('pages.order_plural') },
    {
      urlPattern: '/account/orders/[oid]',
      url: `/account/orders/${orderId}`,
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
      <Result status='empty' mt={8} description={t('order.orderNotFound')} />
    );
  }

  const handlePayment = () => {
    dispatch(goTo(`/account/orders/${order._id}/pay`));
  };

  const isCardPayment =
    order.paymentMethod ===
    sdk.storePaymentMethods.PaymentMethodNames.CREDIT_CARD;

  const shouldPay =
    order.status === sdk.order.OrderStatus.PENDING_PAYMENT && isCardPayment;

  return (
    <Page>
      <Spinner isLoaded={!showSpinner}>
        <OrderSteps t={t} status={order.status} isCardPayment={isCardPayment} />

        <Flex
          mt={6}
          width='100%'
          justify='space-between'
          align={'flex-end'}
          wrap='wrap-reverse'
        >
          <Flex maxWidth={'60rem'} flex={2} direction='column' mx={3}>
            <CustomCard my={3} minWidth={'18rem'}>
              <OrderDescription
                hideDetailsButton
                order={order}
                storeId={store._id}
              />
            </CustomCard>
            {order.deliverTo && (
              <CustomCard minWidth={'18rem'} mt={3}>
                <ShippingDescription address={order.deliverTo} />
              </CustomCard>
            )}
          </Flex>

          <Flex
            align={'flex-start'}
            justify='center'
            width='100%'
            flex={1}
            maxWidth={'60rem'}
            minWidth={'18rem'}
            mx={3}
            my={3}
          >
            <Summary
              maxWidth={'60rem'}
              width='100%'
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
          mt={8}
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
