import React from 'react';
import { ProductCard } from '../ProductCard';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { Set, Button } from '@sradevski/blocks-ui';
import Link from 'next/link';

export const ProductSet = ({
  products,
  allHref,
  title,
  storeId,
}: {
  products: Product[];
  allHref: any;
  title: string;
  storeId: string;
}) => {
  return (
    <>
      <Set
        title={title}
        itemKey={'_id'}
        items={products}
        renderItem={(product: Product) => (
          <ProductCard key={product._id} product={product} storeId={storeId} />
        )}
        footer={
          <Link href={allHref} passHref>
            <Button type='link' mt={2}>
              See all
            </Button>
          </Link>
        }
      />
    </>
  );
};
