import React from 'react';
import { Title, Flex } from 'blocks-ui';

export const Order = ({ order }: any) => {
  return (
    <Flex flexDirection='column' alignItems='center' mb={5}>
      <Title mb={5} level={1}>
        Order {order._id}
      </Title>
    </Flex>
  );
};
