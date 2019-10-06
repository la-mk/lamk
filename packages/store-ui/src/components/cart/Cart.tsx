import React, { useEffect } from 'react';
import {
  Flex,
  List,
  SizedImage,
  Text,
  Button,
  InputNumber,
  Card,
  Empty,
  Spin,
} from '@lamk/blocks-ui';
import { sdk } from '@lamk/la-sdk';
import { Summary } from '../shared/Summary';
import {
  CartItemWithProduct,
  CartWithProducts,
} from '@lamk/la-sdk/dist/models/cart';
import { useSelector, useDispatch } from 'react-redux';
import { setCartWithProducts } from '../../state/modules/cart/cart.module';
import { getCartWithProducts } from '../../state/modules/cart/cart.selector';
import { getDelivery } from '../../state/modules/delivery/delivery.selector';
import { goTo } from '../../state/modules/navigation/navigation.actions';
import { Page } from '../shared/Page';
import { useCall } from '../shared/hooks/useCall';
import { getUser } from '../../state/modules/user/user.selector';

export const Cart = () => {
  const [caller, showSpinner] = useCall();
  const user = useSelector(getUser);
  const cart = useSelector(getCartWithProducts);
  const delivery = useSelector(getDelivery);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && !cart) {
      caller(
        sdk.cart.getCartWithProductsForUser(user._id),
        (cartWithProducts: CartWithProducts) => {
          if (cartWithProducts) {
            return setCartWithProducts(cartWithProducts);
          }
        },
      );
    }
  }, [caller, user, cart]);

  if (!cart || !cart.items || cart.items.length <= 0) {
    return <Empty mt={5} description='You have no items in the cart'></Empty>;
  }

  const handleRemove = (cartItem: CartItemWithProduct) => {
    caller(sdk.cart.removeItemFromCart(cart._id, cartItem), () =>
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
    caller(
      sdk.cart.changeQuantityForCartItem(cart._id, cartItem, quantity),
      () =>
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
    <Page title='My cart'>
      <Spin spinning={showSpinner}>
        <Flex width='100%' flexDirection={['column', 'column', 'row', 'row']}>
          <Flex flex={2} mr={[0, 0, 3, 3]}>
            <List style={{ width: '100%' }}>
              {cart.items.map(cartItem => (
                <List.Item key={cartItem.product._id}>
                  <Flex width={1}>
                    <Flex
                      width='180px'
                      justifyContent='center'
                      alignItems='center'
                    >
                      <SizedImage
                        height='90px'
                        width='100%'
                        alt={cartItem.product.name}
                        src={sdk.artifact.getUrlForArtifact(
                          cartItem.product.images[0],
                        )}
                      />
                    </Flex>
                    <Flex ml={4} width='100%' flexDirection='row'>
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
                          Remove
                        </Button>
                      </Flex>
                      <Flex
                        flex={1}
                        flexDirection='row'
                        justifyContent='space-between'
                        alignItems='center'
                      >
                        <Text>{cartItem.product.price} ден</Text>
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
                          {cartItem.quantity * cartItem.product.price} ден
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </List.Item>
              ))}
            </List>
          </Flex>
          <Flex flex={1} ml={[0, 0, 3, 3]}>
            <Card title='Summary' px={3} width='100%'>
              <Summary
                items={cart.items}
                delivery={delivery}
                buttonTitle='To Checkout'
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
