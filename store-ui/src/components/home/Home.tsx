import React from 'react';
import { StoreLayout } from '../StoreLayout';
import { ProductSet } from '../sets/ProductSet';
import styled from 'styled-components';
import { Flex } from 'blocks-ui';

const Banner = styled.div`
  position: relative;
`;

const ImageBanner = styled.img`
  object-fit: contain;
  width: 100%;
  height: auto;
`;

export const Home = ({ products }: any) => {
  return (
    <StoreLayout>
      <Banner>
        <ImageBanner src='/static/banner.png' alt='Banner image' />
      </Banner>
      <Flex mt={3} flexDirection='column'>
        <ProductSet products={products} title='New arrivals' />
      </Flex>
    </StoreLayout>
  );
};
