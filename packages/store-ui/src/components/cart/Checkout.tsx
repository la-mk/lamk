import React, { useState, useEffect } from 'react';
import {
  Flex,
  Title,
  message,
  Descriptions,
  Card,
  DescriptionItem,
  Button,
  Row,
  Col,
} from 'blocks-ui';
import { Summary } from './Summary';
import { getCartWithProducts } from '../../state/modules/cart/cart.selector';
import { getDelivery } from '../../state/modules/delivery/delivery.selector';
import { useSelector, useDispatch } from 'react-redux';
import { getStore } from '../../state/modules/store/store.selector';
import { sdk } from 'la-sdk';
import { getUser, getAddresses } from '../../state/modules/user/user.selector';
import { Order } from 'la-sdk/dist/models/order';
import { removeItemsFromCart } from '../../state/modules/cart/cart.module';
import { Success } from './Success';
import { replaceTo } from '../../state/modules/navigation/navigation.actions';
import { Address } from 'la-sdk/dist/models/address';

export const Checkout = () => {
  const cart = useSelector(getCartWithProducts);
  const delivery = useSelector(getDelivery);
  const store = useSelector(getStore);
  const user = useSelector(getUser);
  const addresses: Address[] = useSelector(getAddresses);

  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);
  const [deliverTo, setDeliverTo] = useState(null);

  useEffect(() => {
    if (!deliverTo && addresses && addresses.length > 0) {
      setDeliverTo(addresses[0]);
    }
  }, [addresses, deliverTo]);

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
        deliveryMethod: 'door-to-door',
        deliverTo,
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
        sdk.cart.patch(user._id, { items: [] });
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
        <Flex flex={2} flexDirection='column' mr={[0, 0, 3, 3]}>
          <Title level={3}>Choose Shipping</Title>
          <Row
            type='flex'
            align='top'
            justify='start'
            gutter={{ xs: 16, sm: 24, md: 32, lg: 64 }}
          >
            {addresses &&
              addresses.map(address => {
                return (
                  <Col key={address._id} mb={4}>
                    <Card
                      style={
                        deliverTo &&
                        deliverTo._id === address._id && {
                          border: '2px solid #1890ff',
                        }
                      }
                      hoverable={true}
                      onClick={() => setDeliverTo(address)}
                      width='330px'
                      title={address.name}
                    >
                      <Descriptions size='small' column={1}>
                        <DescriptionItem label='Name'>
                          {address.person ||
                            user.firstName + ' ' + user.lastName}
                        </DescriptionItem>
                        <DescriptionItem label='Address'>
                          {address.street}
                        </DescriptionItem>
                        <DescriptionItem label='City'>
                          {address.city}
                        </DescriptionItem>
                        <DescriptionItem label='Country'>
                          {address.country}
                        </DescriptionItem>
                        <DescriptionItem label='Phone Number'>
                          +389 75 212 495
                        </DescriptionItem>
                      </Descriptions>
                    </Card>
                  </Col>
                );
              })}
          </Row>
        </Flex>
        <Flex flex={1} ml={[0, 0, 3, 3]}>
          <Summary
            cart={cart}
            delivery={delivery}
            disabled={!deliverTo}
            buttonTitle={'Order Now'}
            onCheckout={handleOrder}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
