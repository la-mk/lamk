import uniqBy from 'lodash/uniqBy';
import React, { useState, useEffect } from 'react';
import { Flex, Result, Spinner, hooks } from '@sradevski/blocks-ui';
import { Summary } from '../shared/Summary';
import { getCartWithProducts } from '../../state/modules/cart/cart.selector';
import { getDelivery } from '../../state/modules/delivery/delivery.selector';
import { useSelector, useDispatch } from 'react-redux';
import { getStore } from '../../state/modules/store/store.selector';
import { sdk } from '@sradevski/la-sdk';
import { getUser, getAddresses } from '../../state/modules/user/user.selector';
import { Order } from '@sradevski/la-sdk/dist/models/order';
import {
  removeItemsFromCart,
  setCartWithProducts,
} from '../../state/modules/cart/cart.module';
import { Success } from './Success';
import { Address } from '@sradevski/la-sdk/dist/models/address/address';
import { Page } from '../shared/Page';
import { CartWithProducts } from '@sradevski/la-sdk/dist/models/cart';
import { setAddresses } from '../../state/modules/user/user.module';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { useTranslation } from '../../common/i18n';
import { getCampaigns } from '../../state/modules/campaigns/campaigns.selector';
import { setCampaigns } from '../../state/modules/campaigns/campaigns.module';
import { SelectAddress } from './SelectAddress';
import { SelectPaymentMethod } from './SelectPaymentMethod';
import { StorePaymentMethods } from '@sradevski/la-sdk/dist/models/storePaymentMethods';
import { goTo } from '../../state/modules/navigation/navigation.actions';
import { trackEvent } from '../../state/modules/analytics/analytics.actions';
import { AnalyticsEvents } from '@sradevski/analytics';
import { useBreadcrumb } from '../shared/hooks/useBreadcrumb';
import { Campaign } from '@sradevski/la-sdk/dist/models/campaign';

export const Checkout = () => {
  const [caller, showSpinner] = hooks.useCall(true);
  const { t } = useTranslation();
  const cart: CartWithProducts = useSelector(getCartWithProducts);
  const delivery = useSelector(getDelivery);
  const campaigns = useSelector(getCampaigns);
  const store = useSelector(getStore);
  const user = useSelector(getUser);
  const addresses: Address[] = useSelector(getAddresses);
  const [
    storePaymentMethods,
    setStorePaymentMethods,
  ] = useState<StorePaymentMethods | null>(null);

  const dispatch = useDispatch();
  const [trackedEvent, setTrackedEvent] = useState(false);
  const [order, setOrder] = useState(null);
  const [deliverTo, setDeliverTo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(
    sdk.storePaymentMethods.PaymentMethodNames.PAY_ON_DELIVERY,
  );

  useBreadcrumb([
    { url: '/', title: t('pages.home') },
    { url: '/checkout', title: t('pages.checkout') },
  ]);

  useEffect(() => {
    if (!cart || !delivery || !campaigns || trackedEvent) {
      return;
    }

    const prices = sdk.utils.pricing.calculatePrices(
      cart.items,
      delivery,
      campaigns ?? [],
    );

    dispatch(
      trackEvent({
        eventName: AnalyticsEvents.checkout,
        numberOfProducts: cart.items.length,
        totalPrice: prices.total,
        discount: prices.productsTotal - prices.withCampaignsTotal,
      }),
    );

    setTrackedEvent(true);
  }, [cart, delivery, campaigns, trackedEvent]);

  useEffect(() => {
    if (!user || cart) {
      return;
    }

    caller(
      sdk.cart.getCartWithProductsForUser(user._id, store._id),
      (cartWithProducts: CartWithProducts) => {
        if (cartWithProducts) {
          return setCartWithProducts(cartWithProducts);
        }
      },
    );
  }, [caller, user, cart]);

  useEffect(() => {
    if (!user || addresses) {
      return;
    }

    caller(
      sdk.address.findForUser(user._id),
      (addresses: FindResult<Address>) => setAddresses(addresses.data),
    );
  }, [caller, user, addresses]);

  useEffect(() => {
    caller(sdk.campaign.findActiveForStore(store._id), fetchedCampaigns => {
      return setCampaigns(fetchedCampaigns.data);
    });
  }, [caller, store._id]);

  useEffect(() => {
    caller(
      sdk.storePaymentMethods.findForStore(store._id),
      fetchedPaymentMethods => {
        return setStorePaymentMethods(fetchedPaymentMethods.data?.[0]);
      },
    );
  }, [caller, store._id]);

  useEffect(() => {
    if (!deliverTo && addresses?.length > 0) {
      setDeliverTo(addresses[0]);
    }
  }, [addresses, deliverTo]);

  useEffect(() => {
    if (!paymentMethod && storePaymentMethods?.methods.length > 0) {
      setPaymentMethod(storePaymentMethods.methods[0].name);
    }
  }, [storePaymentMethods, paymentMethod]);

  if (
    order &&
    order.paymentMethod ===
      sdk.storePaymentMethods.PaymentMethodNames.PAY_ON_DELIVERY
  ) {
    return <Success mt={[7, 8, 8]} order={order} />;
  }

  if (!cart || !cart.items || cart.items.length <= 0) {
    return (
      <Result
        status='empty'
        mt={8}
        description={t('cart.emptyCartDescription')}
      />
    );
  }

  const handleOrder = () => {
    const ordered = cart.items
      .filter(item => item.fromStore === store._id)
      .map(item => ({
        product: item.product,
        quantity: item.quantity,
      }));

    const applicableCampaigns = uniqBy(
      ordered.map(item => sdk.utils.pricing.getBestCampaign(campaigns, item)),
      (campaign: Campaign | undefined) => campaign?._id,
    )
      .filter(x => !!x)
      // This is not returned by the API, but is required for validation.
      .map(campaign => ({ ...campaign, isActive: true })) as Campaign[];

    caller(
      sdk.order.create({
        orderedFrom: store._id,
        orderedBy: user._id,
        status: sdk.order.OrderStatus.PENDING_SHIPMENT,
        campaigns: applicableCampaigns,
        delivery,
        deliverTo,
        paymentMethod,
        ordered,
        // This is just to make the typings happy, as it will be calculated server-side.
        calculatedTotal: 0,
      }),
      (order: Order) => {
        setOrder(order);

        const prices = sdk.utils.pricing.calculatePrices(
          order.ordered,
          order.delivery,
          order.campaigns,
        );

        dispatch(
          trackEvent({
            eventName: AnalyticsEvents.order,
            numberOfProducts: order.ordered.length,
            paymentMethod: order.paymentMethod,
            totalPrice: order.calculatedTotal,
            discount: prices.productsTotal - prices.withCampaignsTotal,
          }),
        );

        sdk.cart.patch(user._id, { items: [] });
        dispatch(removeItemsFromCart());
        if (
          order.paymentMethod ===
          sdk.storePaymentMethods.PaymentMethodNames.CREDIT_CARD
        ) {
          dispatch(goTo(`/orders/${order._id}/pay`));
        }
      },
    );
  };

  return (
    <Page>
      <Spinner isLoaded={!showSpinner}>
        <Flex
          mt={4}
          justify='space-between'
          align={['center', 'flex-start', 'flex-start']}
          direction={['column', 'row', 'row']}
        >
          <Flex
            px={2}
            maxWidth={'60rem'}
            flex={1}
            direction='column'
            mr={[0, 3, 3]}
          >
            <SelectPaymentMethod
              storePaymentMethods={storePaymentMethods}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
            <SelectAddress
              deliverTo={deliverTo}
              setDeliverTo={setDeliverTo}
              user={user}
            />
          </Flex>

          <Flex
            align={'flex-start'}
            justify='center'
            maxWidth={'32rem'}
            minWidth={'18rem'}
            flex={1}
            ml={[0, 3, 3]}
            mt={[8, 0, 0]}
            mb={[4, 0, 0]}
          >
            <Summary
              showProductsSummary
              storeId={store._id}
              items={cart.items}
              delivery={delivery}
              campaigns={campaigns ?? []}
              disabled={!deliverTo}
              buttonTitle={
                paymentMethod ===
                sdk.storePaymentMethods.PaymentMethodNames.CREDIT_CARD
                  ? t('actions.toPayment')
                  : t('actions.orderNow')
              }
              onCheckout={handleOrder}
            />
          </Flex>
        </Flex>
      </Spinner>
    </Page>
  );
};
