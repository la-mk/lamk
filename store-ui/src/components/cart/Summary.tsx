import sum from 'lodash/sum';
import React from 'react';
import { Flex, Text, Card, Divider, Button } from 'blocks-ui';
import { CartWithProducts } from 'la-sdk/dist/models/cart';
import { Delivery } from 'la-sdk/dist/models/delivery';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '../../state/modules/user/user.selector';
import { toggleAuthModal } from '../../state/modules/ui/ui.module';

interface SummaryProps {
  cart: CartWithProducts;
  delivery: Delivery;
}

export const Summary = ({ cart, delivery }: SummaryProps) => {
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  const subtotal = sum(
    cart.items.map(cartItem => cartItem.quantity * cartItem.product.price),
  );
  const shippingCost =
    delivery.freeDeliveryOver && delivery.freeDeliveryOver < subtotal
      ? 0
      : delivery.price;
  const total = subtotal + shippingCost;

  const handleCheckout = () => {
    if (!user) {
      dispatch(toggleAuthModal(true));
    } else {
      console.log('Checking out');
    }
  };

  return (
    <Card title='Summary' px={3} width='100%'>
      <Flex flexDirection='row' justifyContent='space-between'>
        <Text strong>Subtotal</Text>
        <Text strong>{subtotal} ден</Text>
      </Flex>
      <Flex mt={2} flexDirection='row' justifyContent='space-between'>
        <Text strong>Shipping cost</Text>
        <Text strong>{shippingCost} ден</Text>
      </Flex>
      <Divider />
      <Flex flexDirection='row' justifyContent='space-between'>
        <Text strong>Total</Text>
        <Text strong>{total} ден</Text>
      </Flex>

      <Flex justifyContent='center' alignItems='center'>
        <Button
          onClick={handleCheckout}
          width='100%'
          size='large'
          mt={4}
          type={'primary'}
        >
          Checkout
        </Button>
      </Flex>
    </Card>
  );
};
