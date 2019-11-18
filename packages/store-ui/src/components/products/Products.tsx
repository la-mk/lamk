import React from 'react';
import { FlexGrid } from '@lamk/blocks-ui';
import { ProductCard } from '../ProductCard';
import { Page } from '../shared/Page';
import { Product } from '@lamk/la-sdk/dist/models/product';
import { useTranslation } from '../../common/i18n';

interface ProductsProps {
  products: Product[];
}

export const Products = ({ products }: ProductsProps) => {
  const { t } = useTranslation();
  return (
    <Page title={t('pages.product_plural')}>
      <FlexGrid
        rowKey='_id'
        totalItems={products.length}
        dataSource={products}
        renderItem={(item: any) => <ProductCard product={item} />}
      />
    </Page>
  );
};
