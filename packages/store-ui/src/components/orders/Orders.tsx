import React, { useState, useEffect } from 'react';
import {
  Flex,
  Button,
  List,
  Text,
  Card,
  SizedImage,
  Row,
  Col,
  Empty,
  Spin,
} from '@lamk/blocks-ui';
import Link from 'next/link';
import { Order } from '@lamk/la-sdk/dist/models/order';
import { sdk } from '@lamk/la-sdk';
import { formatDistanceToNow } from 'date-fns';
import { Page } from '../shared/Page';
import { useCall } from '../shared/hooks/useCall';
import { useSelector } from 'react-redux';
import { getUser } from '../../state/modules/user/user.selector';
import { FindResult } from '@lamk/la-sdk/dist/setup';

export const Orders = () => {
  const [caller, showSpinner] = useCall();
  const [orders, setOrders] = useState(null);
  const user = useSelector(getUser);

  useEffect(() => {
    if (!user) {
      return;
    }

    caller(sdk.order.findForUser(user._id), (orders: FindResult<Order>) =>
      setOrders(orders.data),
    );
  }, [user]);

  if (!orders) {
    return <Empty mt={5} description='Orders not found'></Empty>;
  }

  return (
    <Page title='Orders'>
      <Spin spinning={showSpinner}>
        <List style={{ width: '100%' }}>
          {orders.map(order => (
            <Card
              title={
                <Flex
                  mr={3}
                  justifyContent='center'
                  flexDirection='column'
                  height={32}
                >
                  <Text strong>{order.status}</Text>
                  <Text>
                    Ordered{' '}
                    {formatDistanceToNow(new Date(order.createdAt), {
                      addSuffix: true,
                    })}
                  </Text>
                </Flex>
              }
              extra={
                <Link passHref href='/orders/[pid]' as={`/orders/${order._id}`}>
                  <Button type='link'>Order details</Button>
                </Link>
              }
              mb={4}
              key={order._id}
            >
              <Row
                type='flex'
                align='top'
                justify='start'
                gutter={{ xs: 16, sm: 24, md: 32, lg: 64 }}
              >
                {order.ordered.map(orderItem => {
                  return (
                    <Col key={orderItem.product._id} mb={4}>
                      <Card
                        width={340}
                        type='inner'
                        title={orderItem.product.name}
                      >
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
            </Card>
          ))}
        </List>
      </Spin>
    </Page>
  );
};
