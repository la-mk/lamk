import React from 'react';
import { Title, Flex } from 'blocks-ui';
import { Order as OrderType } from 'la-sdk/dist/models/order';

export const Order = ({ order }: { order: OrderType | null }) => {
  if (!order) {
    return <div>No order found</div>;
  }

  return (
    <Flex flexDirection='column' alignItems='center' mb={5}>
      <Title mb={5} level={1}>
        Order {order._id}
      </Title>
    </Flex>
  );
};
