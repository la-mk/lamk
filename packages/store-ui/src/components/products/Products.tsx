import isEqual from 'lodash/isEqual';
import React, { useEffect, useState } from 'react';
import { FlexGrid, Flex, Layout, Sider, Content, Spin } from '@lamk/blocks-ui';
import { ProductCard } from '../ProductCard';
import { Page } from '../shared/Page';
import { Product } from '@lamk/la-sdk/dist/models/product';
import { useTranslation } from '../../common/i18n';
import { Filters } from './Filters';
import { useFilter } from '../shared/hooks/useFilter';
import { useCall } from '../shared/hooks/useCall';
import { FindResult } from '@lamk/la-sdk/dist/setup';
import { sdk } from '@lamk/la-sdk';
import { useSelector } from 'react-redux';
import { getStore } from '../../state/modules/store/store.selector';

interface ProductsProps {
  initialProducts: Product[];
  initialFilters?: any;
}

export const Products = ({
  initialProducts,
  initialFilters = null,
}: ProductsProps) => {
  const { t } = useTranslation();
  const store = useSelector(getStore);
  const [products, setProducts] = useState(initialProducts);
  const [filters, setFilters] = useFilter();
  const [caller, showSpinner] = useCall();

  useEffect(() => {
    if (!store || !store._id || isEqual(filters, initialFilters)) {
      return;
    }

    caller<FindResult<Product>>(
      sdk.product.findForStore(store._id, filters),
      res => setProducts(res.data),
    );
  }, [store, filters, initialFilters]);

  return (
    <Page title={t('pages.product_plural')}>
      <Filters
        mx={'auto'}
        mb={4}
        filters={filters || initialFilters}
        onFiltersChange={setFilters}
      />
      <Spin spinning={showSpinner}>
        <FlexGrid
          rowKey='_id'
          totalItems={products.length}
          dataSource={products}
          renderItem={(item: any) => <ProductCard product={item} />}
        />
      </Spin>
    </Page>
  );
};
