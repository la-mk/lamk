import React, { useEffect } from 'react';
import { Flex, Card, Empty, Spin, hooks } from '@sradevski/blocks-ui';
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
import { useTranslation } from '../../common/i18n';
import { getStore } from '../../state/modules/store/store.selector';
import { getCampaigns } from '../../state/modules/campaigns/campaigns.selector';
import { setCampaigns } from '../../state/modules/campaigns/campaigns.module';
import { trackEvent } from '../../state/modules/analytics/analytics.actions';
import { AnalyticsEvents } from '@sradevski/analytics';
import { useBreadcrumb } from '../shared/hooks/useBreadcrumb';
import { CartProductsList } from './CartProductsList';
import { CustomCard } from '../shared/CustomCard';

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
    return <Empty mt={6} description={t('cart.emptyCartDescription')}></Empty>;
  }

  const handleRemove = (cartItem: CartItemWithProduct) => {
    // If it's not authenticated, the cart comes from local storage, so we don't update the server
    const handler = cart._id
      ? sdk.cart.removeItemFromCart(cart._id, cartItem)
      : Promise.resolve();

    dispatch(
      trackEvent({
        eventName: AnalyticsEvents.removeItemFromCart,
        productId: cartItem.product._id,
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
          item => item.product._id !== cartItem.product._id,
        ),
      }),
    );
  };

  const handleChangeItemQuantity = (
    cartItem: CartItemWithProduct,
    quantity: number,
  ) => {
    const handler = cart._id
      ? sdk.cart.changeQuantityForCartItem(cart._id, cartItem, quantity)
      : Promise.resolve();

    caller<CartType | void>(handler, () =>
      setCartWithProducts({
        ...cart,
        items: cart.items.map(item => {
          if (item.product._id === cartItem.product._id) {
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
      <Spin spinning={showSpinner}>
        <Flex width='100%' flexDirection={['column', 'column', 'row']}>
          <Flex flex={2} mr={[0, 0, 3]}>
            <CartProductsList
              cartItems={cart.items}
              storeId={store._id}
              handleRemove={handleRemove}
              handleChangeItemQuantity={handleChangeItemQuantity}
            />
          </Flex>
          <Flex
            alignItems='center'
            justifyContent='center'
            flex={1}
            ml={[0, 0, 3]}
            mt={[4, 4, 0]}
          >
            <Summary
              items={cart.items}
              delivery={delivery}
              campaigns={campaigns ?? []}
              buttonTitle={t('actions.toCheckout')}
              disabled={false}
              onCheckout={handleCheckout}
            />
          </Flex>
        </Flex>
      </Spin>
    </Page>
  );
};
