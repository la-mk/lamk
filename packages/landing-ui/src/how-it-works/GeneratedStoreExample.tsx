import React from 'react';
import { Title, Text, Image, Flex } from '@sradevski/blocks-ui';

export const GeneratedStoreExample = () => {
  return (
    <Flex
      mt={100}
      maxWidth={820}
      mx='auto'
      alignItems='center'
      justifyContent='center'
      flexDirection='column'
    >
      <Title level={3} textAlign='center'>
        Get a modern store
      </Title>
      <Text maxWidth={620} textAlign='center' mb={4}>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cupiditate,
        ipsam. Quam quod architecto quidem blanditiis ipsa velit placeat quos
        commodi sapiente maiores, nobis sunt illo! Amet nobis dolores assumenda
        vero.
      </Text>
      <Image src='/products-list-illustration.svg' />
    </Flex>
  );
};
