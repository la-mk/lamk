import isEqual from 'lodash/isEqual';
import React, { useState } from 'react';
import { FlexGrid, hooks, utils } from '@sradevski/blocks-ui';
import { ProductCard } from '../ProductCard';
import { Page } from '../shared/Page';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { useTranslation } from '../../common/i18n';
import { Filters } from './Filters';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { sdk } from '@sradevski/la-sdk';
import { useSelector } from 'react-redux';
import { getStore } from '../../state/modules/store/store.selector';
import Router from 'next/router';
import { FilterObject } from '@sradevski/blocks-ui/dist/hooks/useFilter';

interface ProductsProps {
  initialProducts: FindResult<Product>;
  initialFilters?: FilterObject;
}

export const Products = ({
  initialProducts,
  initialFilters = new Object(),
}: ProductsProps) => {
  const { t } = useTranslation();
  const store = useSelector(getStore);
  const [products, setProducts] = useState(initialProducts);
  const [caller, showSpinner] = hooks.useCall();
  const [filters, setFilters] = hooks.useFilter(initialFilters, {
    storage: 'url',
    router: Router,
  });

  React.useEffect(() => {
    if (!store || !store._id) {
      return;
    }

    caller(
      sdk.product.findForStore(store._id, utils.filter.filtersAsQuery(filters)),
      setProducts,
    );
  }, [store, filters]);

  return (
    <Page title={t('pages.product_plural')}>
      <Filters
        mx={'auto'}
        mb={4}
        filters={filters || initialFilters}
        onFiltersChange={setFilters}
      />
      <FlexGrid
        loading={showSpinner}
        rowKey='_id'
        items={products.data}
        renderItem={(item: any) => (
          <ProductCard product={item} storeId={store._id} />
        )}
        pagination={{
          current: filters.pagination ? filters.pagination.currentPage : 1,
          pageSize: filters.pagination ? filters.pagination.pageSize : 20,
          total: products.total,
          onChange: (currentPage: number, pageSize: number) => {
            setFilters({ ...filters, pagination: { currentPage, pageSize } });
          },
        }}
      />
    </Page>
  );
};
