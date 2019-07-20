import React from 'react';
import { ProductCard } from '../shared/ProductCard';
import { Product } from '../../../sdk/models/product';
import { Set } from '../../../component-lib/basic/Set';

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
