import React from 'react';
import {
  Flex,
  List,
  SizedImage,
  Text,
  Button,
  InputNumber,
  Title,
  message,
  Card,
} from 'blocks-ui';
import { sdk } from 'la-sdk';
import { Summary } from '../shared/Summary';
import { CartItemWithProduct } from 'la-sdk/dist/models/cart';
import { useSelector, useDispatch } from 'react-redux';
import { setCartWithProducts } from '../../state/modules/cart/cart.module';
import { getCartWithProducts } from '../../state/modules/cart/cart.selector';
import { getDelivery } from '../../state/modules/delivery/delivery.selector';
import { goTo } from '../../state/modules/navigation/navigation.actions';

export const Cart = () => {
  const cart = useSelector(getCartWithProducts);
  const delivery = useSelector(getDelivery);
  const dispatch = useDispatch();

  if (!cart || !cart.items || cart.items.length <= 0) {
    return <div>Your cart is empty</div>;
  }

  const handleRemove = (cartItem: CartItemWithProduct) => {
    sdk.cart
      .removeItemFromCart(cart._id, cartItem)
      .then(() =>
        setCartWithProducts({
          ...cart,
          items: cart.items.filter(
            item => item.product._id !== cartItem.product._id,
          ),
        }),
      )
      .catch(err => message.error(err));
  };

  const handleChangeItemQuantity = (
    cartItem: CartItemWithProduct,
    quantity: number,
  ) => {
    sdk.cart
      .changeQuantityForCartItem(cart._id, cartItem, quantity)
      .then(() =>
        dispatch(
          setCartWithProducts({
            ...cart,
            items: cart.items.map(item => {
              if (item.product._id === cartItem.product._id) {
                return { ...item, quantity };
              }
              return item;
            }),
          }),
        ),
      )
      .catch(err => message.error(err));
  };

  const handleCheckout = () => {
    dispatch(goTo('/checkout'));
  };

  return (
    <Flex flexDirection='column' alignItems='center' mb={5}>
      <Title mb={5} level={1}>
        Your cart
      </Title>
      <Flex
        px={4}
        width='100%'
        flexDirection={['column', 'column', 'row', 'row']}
      >
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
    </Flex>
  );
};
