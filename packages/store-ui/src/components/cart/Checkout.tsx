import React, { useState } from 'react';
import { Flex, Title, message } from 'blocks-ui';
import { Summary } from './Summary';
import { getCartWithProducts } from '../../state/modules/cart/cart.selector';
import { getDelivery } from '../../state/modules/delivery/delivery.selector';
import { useSelector, useDispatch } from 'react-redux';
import { getStore } from '../../state/modules/store/store.selector';
import { sdk } from 'la-sdk';
import { getUser } from '../../state/modules/user/user.selector';
import { Order } from 'la-sdk/dist/models/order';
import { removeItemsFromCart } from '../../state/modules/cart/cart.module';
import { Success } from './Success';
import { replaceTo } from '../../state/modules/navigation/navigation.actions';

export const Checkout = () => {
  const cart = useSelector(getCartWithProducts);
  const delivery = useSelector(getDelivery);
  const store = useSelector(getStore);
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);

  if (order) {
    return <Success order={order} />;
  }

  if (!cart || !cart.items || cart.items.length <= 0) {
    return <div>Your cart is empty</div>;
  }

  const handleOrder = () => {
    sdk.order
      .create({
        orderedFrom: store._id,
        orderedBy: user._id,
        status: 'pending',
        ordered: cart.items
          .filter(item => item.fromStore === store._id)
          .map(item => ({
            product: item.product,
            quantity: item.quantity,
          })),
      })
      .then((order: Order) => {
        setOrder(order);
        dispatch(removeItemsFromCart());
        return sdk.cart.patch(user._id, { items: [] });
        dispatch(replaceTo(`/orders/${order._id}`));
      })
      .catch(err => message.error(err));
  };

  return (
    <Flex flexDirection='column' alignItems='center' mb={5}>
      <Title mb={5} level={1}>
        Checkout
      </Title>
      <Flex
        px={4}
        width='100%'
        flexDirection={['column', 'column', 'row', 'row']}
      >
        <Flex flex={2} mr={[0, 0, 3, 3]}>
          Hi
        </Flex>
        <Flex flex={1} ml={[0, 0, 3, 3]}>
          <Summary
            cart={cart}
            delivery={delivery}
            buttonTitle={'Order Now'}
            onCheckout={handleOrder}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
