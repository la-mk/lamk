import React from 'react';
import { ProductSet } from './ProductSet';
import { ProductHighlight } from './ProductHighlight';
import { CategoriesSet } from './CategoriesSet';
import { Product } from 'la-sdk/dist/models/product';

export const Sets = ({products}: {products: Product[]}) => {
  return (
    <>
      <CategoriesSet
        categories={[
          { _id: 'home-items', name: 'Home Items', icon: 'home' },
          { _id: 'computers', name: 'Computers', icon: 'laptop' },
        ]}
      />
      <ProductSet products={products} title={'New Arrivals'} />
      <ProductHighlight product={products[0]} />
      <ProductSet products={products} title={'Bestsellers'} />
    </>
  );
};
