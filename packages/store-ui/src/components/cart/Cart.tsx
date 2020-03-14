import React, { useEffect } from 'react';
import {
  Flex,
  List,
  Image,
  Text,
  Button,
  InputNumber,
  Card,
  Empty,
  Spin,
  hooks,
} from '@sradevski/blocks-ui';
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
import { Price } from '../shared/Price';
import { getCampaigns } from '../../state/modules/campaigns/campaigns.selector';
import { setCampaigns } from '../../state/modules/campaigns/campaigns.module';

export const Cart = () => {
  const [caller, showSpinner] = hooks.useCall();
  const user = useSelector(getUser);
  const store = useSelector(getStore);
  const cart = useSelector(getCartWithProducts);
  const delivery = useSelector(getDelivery);
  const campaigns = useSelector(getCampaigns);
  const dispatch = useDispatch();
  const { t } = useTranslation();

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
    if (!campaigns) {
      caller(sdk.campaign.findActiveForStore(store._id), fetchedCampaigns => {
        return setCampaigns(fetchedCampaigns.data);
      });
    }
  }, [caller, campaigns, store._id]);

  if (!cart || !cart.items || cart.items.length <= 0) {
    return <Empty mt={6} description={t('cart.emptyCartDescription')}></Empty>;
  }

  const handleRemove = (cartItem: CartItemWithProduct) => {
    // If it's not authenticated, the cart comes from local storage, so we don't update the server
    const handler = cart._id
      ? sdk.cart.removeItemFromCart(cart._id, cartItem)
      : Promise.resolve();

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
    <Page title={t('pages.myCart')}>
      <Spin spinning={showSpinner}>
        <Flex width='100%' flexDirection={['column', 'column', 'row']}>
          <Flex flex={2} mr={[0, 0, 3]}>
            <List style={{ width: '100%' }}>
              {cart.items.map(cartItem => (
                <List.Item key={cartItem.product._id}>
                  <Flex>
                    <Flex
                      width='180px'
                      justifyContent='center'
                      alignItems='center'
                    >
                      <Image
                        maxHeight='90px'
                        alt={cartItem.product.name}
                        src={sdk.artifact.getUrlForArtifact(
                          cartItem.product.images[0],
                          store._id,
                        )}
                      />
                    </Flex>
                    <Flex
                      ml={[3, 4, 4]}
                      maxWidth='80%'
                      alignItems='flex-start'
                      flexDirection='row'
                    >
                      <Flex
                        flex={1}
                        flexDirection='column'
                        justifyContent='space-between'
                        alignItems='flex-start'
                      >
                        <Text strong>{cartItem.product.name}</Text>
                        <Button
                          onClick={() => handleRemove(cartItem)}
                          pl={0}
                          type='link'
                        >
                          {t('actions.remove')}
                        </Button>
                      </Flex>
                      <Flex
                        flex={1}
                        flexDirection='row'
                        justifyContent='space-between'
                        alignItems='center'
                      >
                        <Price
                          calculatedPrice={cartItem.product.calculatedPrice}
                          basePrice={cartItem.product.price}
                          currency='ден'
                        />
                        <InputNumber
                          width='80px'
                          size='default'
                          min={1}
                          max={999}
                          value={cartItem.quantity}
                          onChange={value =>
                            handleChangeItemQuantity(cartItem, value)
                          }
                          mx={2}
                        />
                        <Text strong>
                          {cartItem.quantity * cartItem.product.calculatedPrice}{' '}
                          ден
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </List.Item>
              ))}
            </List>
          </Flex>
          <Flex flex={1} ml={[0, 0, 3]} mt={[4, 4, 0]}>
            <Card title={t('common.summary')} px={3} width='100%'>
              <Summary
                items={cart.items}
                delivery={delivery}
                campaigns={campaigns ?? []}
                buttonTitle={t('actions.toCheckout')}
                disabled={false}
                onCheckout={handleCheckout}
              />
            </Card>
          </Flex>
        </Flex>
      </Spin>
    </Page>
  );
};
