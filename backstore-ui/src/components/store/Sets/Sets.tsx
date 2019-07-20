import React from 'react';
import { ProductSet } from './ProductSet';
import { useSelector } from 'react-redux';
import { getProducts } from '../../../state/modules/products/products.selector';
import { ProductHighlight } from './ProductHighlight';
import { CategoriesSet } from './CategoriesSet';

export const Sets = () => {
  const products = useSelector(getProducts);
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
