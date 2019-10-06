import React, { useState, useEffect } from 'react';
import {
  Flex,
  Title,
  Card,
  Row,
  Col,
  Button,
  Empty,
  Spin,
} from '@lamk/blocks-ui';
import { Summary } from '../shared/Summary';
import { getCartWithProducts } from '../../state/modules/cart/cart.selector';
import { getDelivery } from '../../state/modules/delivery/delivery.selector';
import { useSelector, useDispatch } from 'react-redux';
import { getStore } from '../../state/modules/store/store.selector';
import { sdk } from '@lamk/la-sdk';
import { getUser, getAddresses } from '../../state/modules/user/user.selector';
import { Order } from '@lamk/la-sdk/dist/models/order';
import {
  removeItemsFromCart,
  setCartWithProducts,
} from '../../state/modules/cart/cart.module';
import { Success } from './Success';
import { Address } from '@lamk/la-sdk/dist/models/address';
import { ShippingDescription } from '../shared/ShippingDescription';
import { AddressesModal } from '../account/AddressesModal';
import { Page } from '../shared/Page';
import { useCall } from '../shared/hooks/useCall';
import { CartWithProducts } from '@lamk/la-sdk/dist/models/cart';
import { setAddresses } from '../../state/modules/user/user.module';
import { FindResult } from '@lamk/la-sdk/dist/setup';

export const Checkout = () => {
  const [caller, showSpinner] = useCall();
  const cart = useSelector(getCartWithProducts);
  const delivery = useSelector(getDelivery);
  const store = useSelector(getStore);
  const user = useSelector(getUser);
  const addresses: Address[] = useSelector(getAddresses);
  const dispatch = useDispatch();

  const [order, setOrder] = useState(null);
  const [deliverTo, setDeliverTo] = useState(null);
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  useEffect(() => {
    if (!user || cart) {
      return;
    }

    caller(
      sdk.cart.getCartWithProductsForUser(user._id),
      (cartWithProducts: CartWithProducts) => {
        if (cartWithProducts) {
          return setCartWithProducts(cartWithProducts);
        }
      },
    );
  }, [caller, user, cart]);

  useEffect(() => {
    if (!user || addresses) {
      return;
    }

    caller(
      sdk.address.findForUser(user._id),
      (addresses: FindResult<Address>) => setAddresses(addresses.data),
    );
  }, [caller, user, addresses]);

  useEffect(() => {
    if (!deliverTo && addresses && addresses.length > 0) {
      setDeliverTo(addresses[0]);
    }
  }, [addresses, deliverTo]);

  if (order) {
    return <Success order={order} />;
  }

  if (!cart || !cart.items || cart.items.length <= 0) {
    return <Empty mt={5} description='You have no items in the cart'></Empty>;
  }

  const handleOrder = () => {
    caller(
      sdk.order.create({
        orderedFrom: store._id,
        orderedBy: user._id,
        status: 'pending',
        delivery,
        deliverTo,
        ordered: cart.items
          .filter(item => item.fromStore === store._id)
          .map(item => ({
            product: item.product,
            quantity: item.quantity,
          })),
      }),
      (order: Order) => {
        setOrder(order);
        dispatch(removeItemsFromCart());
        sdk.cart.patch(user._id, { items: [] });
      },
    );
  };

  return (
    <Page title='Checkout'>
      <Spin spinning={showSpinner}>
        <Flex width='100%' flexDirection={['column', 'column', 'row', 'row']}>
          <Flex flex={2} flexDirection='column' mr={[0, 0, 3, 3]}>
            <Title level={3}>Choose Shipping Address</Title>
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
                          deliverTo && deliverTo._id === address._id
                            ? {
                                border: '2px solid #1890ff',
                              }
                            : {}
                        }
                        hoverable={true}
                        onClick={() => setDeliverTo(address)}
                        width='330px'
                        title={address.name}
                      >
                        <ShippingDescription address={address} />
                      </Card>
                    </Col>
                  );
                })}
              <Col key={'new'} mb={4}>
                <Button
                  size='large'
                  onClick={() => setAddressModalVisible(true)}
                >
                  Add New Address
                </Button>
              </Col>
            </Row>
          </Flex>
          <Flex flex={1} ml={[0, 0, 3, 3]}>
            <Card title='Summary' px={3} width='100%'>
              <Summary
                items={cart.items}
                delivery={delivery}
                disabled={!deliverTo}
                buttonTitle={'Order Now'}
                onCheckout={handleOrder}
              />
            </Card>
          </Flex>
        </Flex>
        <AddressesModal
          user={user}
          visible={addressModalVisible}
          onClose={() => setAddressModalVisible(false)}
        />
      </Spin>
    </Page>
  );
};
