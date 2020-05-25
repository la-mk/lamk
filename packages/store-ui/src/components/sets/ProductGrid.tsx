import React from 'react';
import { FlexGrid, Box, hooks } from '@sradevski/blocks-ui';
import { ProductCard } from '../shared/product/ProductCard';
import { ProductSet } from '@sradevski/la-sdk/dist/models/product';
import { SetTitle } from './SetTitle';
import { SeeAllLink } from './SeeAllLink';
import {
  useTranslation,
  getTitleForSet,
  getSubtitleForSet,
} from '../../common/i18n';
import { getSetHref } from '../../common/filterUtils';

interface ProductGridProps {
  set: ProductSet;
  storeId: string;
  horizontal?: boolean;
}

export const ProductGrid = ({ set, storeId, horizontal }: ProductGridProps) => {
  const { t } = useTranslation();
  const productCount = hooks.useBreakpoint([6, 6, 8]);
  const productCountHorizontal = hooks.useBreakpoint([3, 4, 6]);

  const allHref = getSetHref(set);
  const products = set.data;
  const title = t(getTitleForSet(set.setTag));
  const subtitle = t(getSubtitleForSet(set.setTag));

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
      <SeeAllLink allHref={allHref} t={t} />
    </>
  );
};
