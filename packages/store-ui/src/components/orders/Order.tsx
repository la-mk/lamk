import React, { useState, useEffect } from 'react';
import {
  Title,
  Flex,
  Steps,
  Step,
  Card,
  Row,
  Col,
  SizedImage,
  Text,
  Empty,
  Spin,
} from 'blocks-ui';
import { Order as OrderType } from 'la-sdk/dist/models/order';
import { ShippingDescription } from '../shared/ShippingDescription';
import { sdk } from 'la-sdk';
import { useSelector } from 'react-redux';
import { getDelivery } from '../../state/modules/delivery/delivery.selector';
import { Summary } from '../shared/Summary';
import { Page } from '../shared/Page';
import { getUser } from '../../state/modules/user/user.selector';
import { useCall } from '../shared/hooks/useCall';

const getStepIndex = (status: OrderType['status']) => {
  switch (status) {
    case 'pending':
      return 0;
    case 'shipped':
      return 1;
    case 'completed':
    case 'cancelled':
      return 2;
  }
};

export const Order = ({ orderId }: { orderId: string }) => {
  const [caller, showSpinner] = useCall();
  const delivery = useSelector(getDelivery);
  const user = useSelector(getUser);
  const [order, setOrder] = useState<OrderType>(null);
  const status = order && order.status;
  const stepIndex = status ? getStepIndex(status) : 0;

  useEffect(() => {
    if (orderId && user) {
      caller(sdk.order.get(orderId), setOrder);
    }
  }, [user, orderId]);

  if (!order) {
    return <Empty mt={5} description='Order not found'></Empty>;
  }

  return (
    <Page title='Order'>
      <Spin spinning={showSpinner}>
        <Steps progressDot current={stepIndex}>
          <Step title='Pending' description='Awaiting shipment' />
          <Step title='Shipped' description='Awaiting arrival' />
          {status !== 'cancelled' && (
            <Step title='Completed' description='All done!' />
          )}
          {status === 'cancelled' && (
            <Step
              status='error'
              title='Cancelled'
              description='Order cancelled'
            />
          )}
        </Steps>

        <Flex flexWrap='wrap' my={4} justifyContent='center'>
          {order.deliverTo && (
            <Card m={3} width={330} title={'Shipping address'}>
              <ShippingDescription address={order.deliverTo} />
            </Card>
          )}

          <Card m={3} width={330} title={'Price breakdown'}>
            <Summary items={order.ordered} delivery={delivery} />
          </Card>
        </Flex>
        <Title mb={3} level={3}>
          Items
        </Title>
        <Row
          type='flex'
          align='top'
          justify='start'
          gutter={{ xs: 16, sm: 24, md: 32, lg: 64 }}
        >
          {order.ordered.map(orderItem => {
            return (
              <Col key={orderItem.product._id} mb={4}>
                <Card width={340} type='inner' title={orderItem.product.name}>
                  <Flex width={1}>
                    <Flex justifyContent='center' alignItems='center'>
                      <SizedImage
                        height='90px'
                        width='180px'
                        alt={orderItem.product.name}
                        src={sdk.artifact.getUrlForArtifact(
                          orderItem.product.images[0],
                        )}
                      />
                    </Flex>
                    <Flex ml={4} width='100%' flexDirection='row'>
                      <Flex flexDirection='column'>
                        <Text>{orderItem.product.price} ден</Text>
                        <Text mt={2}>{orderItem.quantity} items</Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Spin>
    </Page>
  );
};
