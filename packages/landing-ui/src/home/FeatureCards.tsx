import React from 'react';
import { Flex, Image, Title, Text } from '@sradevski/blocks-ui';
import styled from 'styled-components';

const FeatureCardContainer = styled(Flex)`
  border-radius: 8px;
  box-shadow: 10px, 5px, 10px, 5px lightgray;
`;

const FeatureCard = () => {
  return (
    <FeatureCardContainer
      p={4}
      mx={2}
      mb={3}
      maxWidth={'300px'}
      minWidth={'200px'}
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
    >
      <Image src='/cardimage.svg' />
      <Title level={3}>Invoices</Title>
      <Text style={{ textAlign: 'center' }}>
        Something something something something something something
      </Text>
    </FeatureCardContainer>
  );
};

export const FeatureCards = (props) => {
  return (
    <Flex
      {...props}
      flexDirection={['column', 'column', 'row']}
      alignItems='center'
      justifyContent='center'
    >
      <Flex flexDirection={['column', 'row', 'row']}>
        <FeatureCard />
        <FeatureCard />
      </Flex>
      <Flex flexDirection={['column', 'row', 'row']}>
        <FeatureCard />
        <FeatureCard />
      </Flex>
    </Flex>
  );
};
