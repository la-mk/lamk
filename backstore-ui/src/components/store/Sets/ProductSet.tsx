import React from 'react';
import { ProductCard } from '../shared/ProductCard';
import { Product } from 'la-sdk/dist/models/product';
import { Set } from 'blocks-ui/dist/basic/Set';

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
