import React from 'react';
import { ProductCard } from '../ProductCard';
import { Product } from '@lamk/la-sdk/dist/models/product';
import { Set } from '@lamk/blocks-ui';

export const ProductSet = ({
  products,
  onSeeAll,
  title,
}: {
  products: Product[];
  onSeeAll: () => void;
  title: string;
}) => {
  return (
    <>
      <Set
        onSeeAll={onSeeAll}
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
