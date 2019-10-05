import React from 'react';
import { ProductCard } from '../ProductCard';
import { Product } from '@lamk/la-sdk/dist/models/product';
import { Set } from '@lamk/blocks-ui';

export const ProductSet = ({
  products,
  title,
}: {
  products: Product[];
  title: string;
}) => {
  return (
    <>
      <Set
        title={title}
        itemKey={'_id'}
        items={products}
        renderItem={(product: Product) => (
          <ProductCard key={product._id} product={product} />
        )}
      />
    </>
  );
};
