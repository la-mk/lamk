import React from 'react';
import { FlexGrid, Box, hooks } from '@sradevski/blocks-ui';
import { ProductCard } from '../shared/ProductCard';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { SetTitle } from './SetTitle';

interface ProductGridProps {
  products: Product[];
  storeId: string;
  title: string;
  subtitle: string;
  horizontal?: boolean;
}

export const ProductGrid = ({
  products,
  storeId,
  title,
  subtitle,
  horizontal,
}: ProductGridProps) => {
  const productCount = hooks.useBreakpoint([6, 6, 8]);
  const productCountHorizontal = hooks.useBreakpoint([3, 4, 6]);
  const productsToShow = products.slice(
    0,
    horizontal ? productCountHorizontal : productCount,
  );

  return (
    <>
      <SetTitle title={title} subtitle={subtitle} />
      <FlexGrid
        loading={false}
        rowKey='_id'
        items={productsToShow}
        renderItem={item => (
          <Box mx={[1, 2, 2]} mb={'auto'}>
            <ProductCard
              product={item}
              storeId={storeId}
              horizontal={horizontal}
            />
          </Box>
        )}
      />
    </>
  );
};
