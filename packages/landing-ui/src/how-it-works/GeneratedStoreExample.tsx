import React from 'react';
import { Title, Text, Image, Flex } from '@sradevski/blocks-ui';

export const GeneratedStoreExample = () => {
  return (
    <Flex
      mt={100}
      maxWidth={980}
      mx='auto'
      px={3}
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
      <Image
        display={['none', 'block', 'block']}
        src='/products-list-illustration.svg'
      />
      <Image
        display={['block', 'none', 'none']}
        src='/products-list-mobile.svg'
      />
    </Flex>
  );
};
