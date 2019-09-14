import sum from 'lodash/sum';
import React from 'react';
import { Flex, Text, Card, Divider, Button } from 'blocks-ui';
import Link from 'next/link';

export const Summary = ({ cartItems, delivery }: any) => {
  console.log(delivery);
  const subtotal = sum(
    cartItems.map(cartItem => cartItem.quantity * cartItem.product.price),
  );
  const shippingCost =
    delivery.freeDeliveryOver && delivery.freeDeliveryOver < subtotal
      ? 0
      : delivery.price;
  const total = subtotal + shippingCost;

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
        <Link href='/products' passHref>
          <Button width='100%' size='large' mt={4} type={'primary'}>
            Checkout
          </Button>
        </Link>
      </Flex>
    </Card>
  );
};
