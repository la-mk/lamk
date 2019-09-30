import React from 'react';
import { ProductSet } from '../sets/ProductSet';
import { CategoriesList } from '../CategoriesList';
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
    <>
      <CategoriesList />
      <Banner>
        <ImageBanner src='/static/banner.jpg' alt='Banner image' />
      </Banner>
      <Flex mt={3} flexDirection='column'>
        <ProductSet products={products} title='New arrivals' />
      </Flex>
    </>
  );
};
