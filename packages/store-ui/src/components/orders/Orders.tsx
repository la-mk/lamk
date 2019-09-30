import React from 'react';
import { Flex, Title, Button, List, Text } from 'blocks-ui';
import Link from 'next/link';
import { Order } from 'la-sdk/dist/models/order';

export const Orders = ({ orders }: { orders: Order[] }) => {
  if (!orders) {
    return <div>No orders found</div>;
  }

  return (
    <Flex mx={3} flexDirection='column' alignItems='center' mb={5}>
      <Title mb={5} level={1}>
        Orders
      </Title>
      <List style={{ width: '100%' }}>
        {orders.map(order => (
          <List.Item key={order._id}>
            <Flex width={1}>
              <Flex justifyContent='center' alignItems='center'>
                {order.ordered.map(orderItem => {
                  return (
                    <Text key={orderItem.product.name}>
                      {orderItem.product.name}
                    </Text>
                  );
                })}
              </Flex>
              <Flex ml={4} width='100%' flexDirection='row'>
                <Text>Status: {order.status}</Text>
              </Flex>
              <Link passHref href='/orders/[pid]' as={`/orders/${order._id}`}>
                <Button type='link'>Order details</Button>
              </Link>
            </Flex>
          </List.Item>
        ))}
      </List>
    </Flex>
  );
};
