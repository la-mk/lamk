import React from 'react';
import { Flex, Title, Button } from '@sradevski/blocks-ui';

export const Hero = () => {
  return (
    <Flex flexDirection='column' alignItems='center' justifyContent='center'>
      <Flex
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        mt={100}
      >
        <Title level={1}>Online shop in 5 minutes</Title>
        <Title level={4} type='secondary'>
          The easiest way to build an online shop
        </Title>
        <Button mt={3} type='primary' size='large'>
          Watch demo
        </Button>
      </Flex>
    </Flex>
  );
};
