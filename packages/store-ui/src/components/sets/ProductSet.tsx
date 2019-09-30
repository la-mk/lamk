import React from 'react';
import { ProductCard, CARD_WIDTH } from '../ProductCard';
import { Product } from 'la-sdk/dist/models/product';
import { Set } from 'blocks-ui';

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
        itemWidth={CARD_WIDTH}
        renderItem={(product: Product) => (
          <ProductCard key={product._id} product={product} />
        )}
      />
    </>
  );
};
