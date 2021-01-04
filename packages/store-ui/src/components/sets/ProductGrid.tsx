import React from 'react';
import { DataGrid, Box, hooks } from '@la-mk/blocks-ui';
import { ProductCard } from '../shared/product/ProductCard';
import { ProductSetResult } from '@la-mk/la-sdk/dist/models/product';
import { SetTitle } from './SetTitle';
import { SeeAllLink } from './SeeAllLink';
import { useTranslation } from '../../common/i18n';
import { getSetHref } from '../../common/filterUtils';

interface ProductGridProps {
  set: ProductSetResult;
  storeId: string;
  horizontal?: boolean;
}

export const ProductGrid = ({ set, storeId, horizontal }: ProductGridProps) => {
  const { t } = useTranslation();
  const productCount = hooks.useBreakpoint([6, 6, 8]);
  const productCountHorizontal = hooks.useBreakpoint([3, 4, 6]);

  const allHref = getSetHref(set);
  const products = set.data;
  const productsToShow = products.slice(
    0,
    horizontal ? productCountHorizontal : productCount,
  );

  return (
    <>
      <SetTitle title={set.setTag.title} subtitle={set.setTag.subtitle} />
      <DataGrid
        isLoaded={true}
        spacing={[4, 5, 5]}
        rowKey='_id'
        items={productsToShow}
        renderItem={item => (
          <Box mb={'auto'}>
            <ProductCard
              product={item}
              storeId={storeId}
              horizontal={horizontal}
            />
          </Box>
        )}
      />
      <SeeAllLink allHref={allHref} t={t} />
    </>
  );
};
