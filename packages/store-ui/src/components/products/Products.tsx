import React from 'react';
import { FlexGrid } from '@lamk/blocks-ui';
import { ProductCard } from '../ProductCard';
import { Page } from '../shared/Page';
import { Product } from '@lamk/la-sdk/dist/models/product';

interface ProductsProps {
  products: Product[];
}

export const Products = ({ products }: ProductsProps) => {
  return (
    <Page title='Products'>
      <FlexGrid
        rowKey='_id'
        totalItems={products.length}
        dataSource={products}
        renderItem={(item: any) => <ProductCard product={item} />}
      />
    </Page>
  );
};
