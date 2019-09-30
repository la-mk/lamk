import sum from 'lodash/sum';
import React from 'react';
import { Flex, Text, Card, Divider, Button, message } from 'blocks-ui';
import { CartItemWithProduct } from 'la-sdk/dist/models/cart';
import { Delivery } from 'la-sdk/dist/models/delivery';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '../../state/modules/user/user.selector';
import { toggleAuthModal } from '../../state/modules/ui/ui.module';
import { OrderItem } from 'la-sdk/dist/models/order';

interface SummaryProps {
  items: (CartItemWithProduct | OrderItem)[];
  delivery: Delivery;
  buttonTitle?: string;
  disabled?: boolean;
  onCheckout?: () => void;
}

export const Summary = ({
  items,
  delivery,
  buttonTitle,
  disabled,
  onCheckout,
}: SummaryProps) => {
  const user = useSelector(getUser);
  const dispatch = useDispatch();

  const subtotal = sum(items.map(item => item.quantity * item.product.price));
  const shippingCost =
    delivery.freeDeliveryOver && delivery.freeDeliveryOver < subtotal
      ? 0
      : delivery.price;
  const total = subtotal + shippingCost;

  const handleCheckout = () => {
    if (!user) {
      dispatch(toggleAuthModal(true));
    } else {
      onCheckout();
    }
  };

  return (
    <>
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

      {onCheckout && (
        <Flex justifyContent='center' alignItems='center'>
          <Button
            disabled={disabled}
            onClick={handleCheckout}
            width='100%'
            size='large'
            mt={4}
            type={'primary'}
          >
            {buttonTitle}
          </Button>
        </Flex>
      )}
    </>
  );
};
