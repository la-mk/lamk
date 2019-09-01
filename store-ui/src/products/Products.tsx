import React from 'react';
import { Flex, FlexGrid, Title } from 'blocks-ui';
import { ProductCard } from '../ProductCard';
import Link from 'next/link';
import { StoreLayout } from '../StoreLayout';

export const Products = ({ products }) => {
  return (
    <StoreLayout>
      <Flex flexDirection='column' alignItems='center'>
        <Title mb={5} level={1}>
          All Products
        </Title>
        <FlexGrid
          rowKey='_id'
          totalItems={products.length}
          dataSource={products}
          renderItem={(item: any) => (
            <Link href='/products/[pid]' as={`/products/${item._id}`}>
              <a>
                <ProductCard product={item} />
              </a>
            </Link>
          )}
        />
      </Flex>
    </StoreLayout>
  );
};
