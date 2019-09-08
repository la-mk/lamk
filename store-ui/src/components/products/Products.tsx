import React from 'react';
import { Flex, FlexGrid, Title } from 'blocks-ui';
import { ProductCard } from '../ProductCard';

export const Products = ({ products }) => {
  return (
    <>
      <Flex flexDirection='column' alignItems='center'>
        <Title mb={5} level={1}>
          All Products
        </Title>
        <FlexGrid
          rowKey='_id'
          totalItems={products.length}
          dataSource={products}
          renderItem={(item: any) => <ProductCard product={item} />}
        />
      </Flex>
    </>
  );
};
