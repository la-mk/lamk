import React from 'react';
import { Flex } from '../../../component-lib/basic/Flex';
import { sdk } from '../../../sdk';
import { Title, Text } from '../../../component-lib/basic/Typography';
import { Button } from '../../../component-lib/basic/Button';
import styled from 'styled-components';

const ResponsiveImage = styled.img`
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
`;

const Container = styled(Flex)`
  background: linear-gradient(to left, #66ccff 19%, #ccffff 91%);
`;

export const ProductHighlight = ({ product }: any) => {
  return (
    <Container height={350} flexDirection={'row'}>
      <Flex
        py={[3, 3, 4]}
        px={[3, 4, 5]}
        width={'50%'}
        alignItems='center'
        justifyContent='center'
      >
        <ResponsiveImage
          alt={`${product.name}`}
          src={sdk.artifact.getUrlForArtifact(product.images[0])}
        />
      </Flex>
      <Flex
        py={[3, 3, 4]}
        px={[3, 4, 5]}
        width={'50%'}
        justifyContent='space-between'
        flexDirection='column'
      >
        <Flex flexDirection='column'>
          <Title level={2}>{product.name}</Title>
          <Text>{product.description}</Text>
        </Flex>
        <Flex width={'100%'} alignSelf='center'>
          <Button type='primary' width='100%' icon='shopping-cart'>
            {' '}
            Add to Cart
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
};
