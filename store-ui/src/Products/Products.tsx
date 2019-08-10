import React from 'react';
import { FlexGrid } from 'blocks-ui/dist/basic/FlexGrid';
import { ProductCard } from '../shared/ProductCard';
import { Product } from 'la-sdk/dist/models/product';
import { Title } from 'blocks-ui/dist/basic/Typography';
import { Flex } from 'blocks-ui/dist/basic/Flex';

export const Products = ({products}: { products: Product[]}) => {
  return (
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
  );
};
