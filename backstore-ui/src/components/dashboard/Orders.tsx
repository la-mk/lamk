import React from 'react';
import { Tooltip } from '../../component-lib/basic/Tooltip';
import { Flex } from '../../component-lib/basic/Flex';

export const Orders = () => {
  return (
    <Flex flexDirection='column' px={[3, 3, 3, 4]} py={4}>
      <Tooltip title='Hello world'>Hello world</Tooltip>
    </Flex>
  );
};
