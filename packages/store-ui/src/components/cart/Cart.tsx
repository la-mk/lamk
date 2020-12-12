import React, { useEffect } from 'react';
import { Flex, Result, Spinner, hooks } from '@sradevski/blocks-ui';
import { sdk } from '@sradevski/la-sdk';
import { Summary } from '../shared/Summary';
import {
  CartItemWithProduct,
  CartWithProducts,
  Cart as CartType,
} from '@sradevski/la-sdk/dist/models/cart';
import { useSelector, useDispatch } from 'react-redux';
import { setCartWithProducts } from '../../state/modules/cart/cart.module';
import { getCartWithProducts } from '../../state/modules/cart/cart.selector';
import { getDelivery } from '../../state/modules/delivery/delivery.selector';
import { goTo } from '../../state/modules/navigation/navigation.actions';
import { Page } from '../shared/Page';
import { getUser } from '../../state/modules/user/user.selector';
import {
  getSubtitleForSet,
  getTitleForSet,
  useTranslation,
} from '../../common/i18n';
import { getStore } from '../../state/modules/store/store.selector';
import { getCampaigns } from '../../state/modules/campaigns/campaigns.selector';
import { setCampaigns } from '../../state/modules/campaigns/campaigns.module';
import { trackEvent } from '../../state/modules/analytics/analytics.actions';
import { AnalyticsEvents } from '@sradevski/analytics';
import { useBreadcrumb } from '../shared/hooks/useBreadcrumb';
import { OrderProductsList } from '../shared/product/OrderProductsList';
import { ManagedSets } from '../sets/ManagedSets';

export const Cart = () => {
  const [caller, showSpinner] = hooks.useCall(true);
  const user = useSelector(getUser);
  const store = useSelector(getStore);
  const cart = useSelector(getCartWithProducts);
  const delivery = useSelector(getDelivery);
  const campaigns = useSelector(getCampaigns);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useBreadcrumb([
    { url: '/', title: t('pages.home') },
    { url: '/cart', title: t('pages.myCart') },
  ]);

  useEffect(() => {
    dispatch(
      trackEvent({
        eventName: AnalyticsEvents.viewCart,
      }),
    );
  }, []);

  useEffect(() => {
    if (user && !cart) {
      caller(
        sdk.cart.getCartWithProductsForUser(user._id, store._id),
        (cartWithProducts: CartWithProducts) => {
          if (cartWithProducts) {
            return setCartWithProducts(cartWithProducts);
          }
        },
      );
    }
  }, [caller, user, cart, store._id]);

  useEffect(() => {
    caller(sdk.campaign.findActiveForStore(store._id), fetchedCampaigns => {
      return setCampaigns(fetchedCampaigns.data);
    });
  }, [caller, store._id]);

  if (!cart || !cart.items || cart.items.length <= 0) {
    return (
      <Result
        status='empty'
        mt={8}
        description={t('cart.emptyCartDescription')}
      />
    );
  }

  const handleRemove = (cartItem: CartItemWithProduct) => {
    // If it's not authenticated, the cart comes from local storage, so we don't update the server
    const handler =
      user && cart._id
        ? sdk.cart.removeItemFromCart(cart._id, cartItem)
        : Promise.resolve();

    dispatch(
      trackEvent({
        eventName: AnalyticsEvents.removeItemFromCart,
        productId: cartItem.product._id,
        attributes: cartItem.product.attributes
          ? JSON.stringify(cartItem.product.attributes)
          : undefined,
        category: cartItem.product.category,
        price: cartItem.product.calculatedPrice,
        discount: cartItem.product.discount,
        quantity: cartItem.quantity,
      }),
    );

    caller<CartType | void>(handler, () =>
      setCartWithProducts({
        ...cart,
        items: cart.items.filter(
          item =>
            !(
              item.product._id === cartItem.product._id &&
              sdk.product.areAttributesEquivalent(
                item.product.attributes,
                cartItem.product.attributes,
              )
            ),
        ),
      }),
    );
  };

  const handleChangeItemQuantity = (
    cartItem: CartItemWithProduct,
    quantity: number,
  ) => {
    const handler =
      user && cart._id
        ? sdk.cart.changeQuantityForCartItem(cart._id, cartItem, quantity)
        : Promise.resolve();

    caller<CartType | void>(handler, () =>
      setCartWithProducts({
        ...cart,
        items: cart.items.map(item => {
          if (
            item.product._id === cartItem.product._id &&
            sdk.product.areAttributesEquivalent(
              item.product.attributes,
              cartItem.product.attributes,
            )
          ) {
            return { ...item, quantity };
          }
          return item;
        }),
      }),
    );
  };

  const handleCheckout = () => {
    dispatch(goTo('/checkout'));
  };

  return (
    <Page>
      <Spinner isLoaded={!showSpinner}>
        <Flex width='100%' direction={['column', 'column', 'row']}>
          <Flex direction='column' flex={2} mr={[0, 0, 3]}>
            <OrderProductsList
              items={cart.items}
              storeId={store._id}
              handleRemove={handleRemove}
              handleChangeItemQuantity={handleChangeItemQuantity}
            />
          </Flex>
          <Flex
            align='center'
            justify='center'
            flex={1}
            ml={[0, 0, 3]}
            mt={[5, 5, 0]}
          >
            <Summary
              showContinueShopping
              items={cart.items}
              delivery={delivery}
              campaigns={campaigns ?? []}
              buttonTitle={t('actions.toCheckout')}
              disabled={false}
              onCheckout={handleCheckout}
            />
          </Flex>
        </Flex>
      </Spinner>

      <ManagedSets
        mt={8}
        storeId={store._id}
        setTags={[
          {
            title: t(getTitleForSet({ type: 'latest', value: undefined })),
            subtitle: t(
              getSubtitleForSet({ type: 'latest', value: undefined }),
            ),
            type: 'latest',
            value: undefined,
            isPromoted: false,
          },
        ]}
      />
    </Page>
  );
};
