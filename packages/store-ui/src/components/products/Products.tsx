import merge from 'lodash/fp/merge';
import isEqual from 'lodash/isEqual';
import set from 'lodash/fp/set';
import unset from 'lodash/fp/unset';
import React, { useState, useMemo, useCallback } from 'react';
import { FlexGrid, hooks } from '@sradevski/blocks-ui';
import { ProductCard } from '../ProductCard';
import { Page } from '../shared/Page';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { useTranslation } from '../../common/i18n';
import { Filters } from './Filters';
import { useFilter } from '../shared/hooks/useFilter';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { sdk } from '@sradevski/la-sdk';
import { useSelector } from 'react-redux';
import { getStore } from '../../state/modules/store/store.selector';

interface ProductsProps {
  initialProducts: FindResult<Product>;
  initialFilters?: any;
}

const setPagination = (filters: any, currentPage: number, pageSize: number) => {
  if (currentPage <= 1) {
    return unset('query.$limit', unset('query.$skip', filters));
  }

  return set(
    'query.$limit',
    pageSize,
    set('query.$skip', (currentPage - 1) * pageSize, filters),
  );
};

const parsePagination = ($limit: any, $skip: any, defaultPageSize: number) => {
  const pageSize = $limit || defaultPageSize;
  const current = $skip ? $skip / pageSize + 1 : 1;
  return {
    current,
    pageSize,
  };
};

export const Products = ({
  initialProducts,
  initialFilters = new Object(),
}: ProductsProps) => {
  const { t } = useTranslation();
  const store = useSelector(getStore);
  const [products, setProducts] = useState(initialProducts.data);
  const [filters, setFilters] = useFilter();

  // @ts-ignore
  const { $limit, $skip } = filters && filters.query ? filters.query : {};
  const paginationFilters = parsePagination($limit, $skip, 20);

  const fetcher = useMemo(
    () =>
      !store || !store._id || isEqual(filters, initialFilters)
        ? null
        : (params: any) =>
            sdk.product.findForStore(store._id, merge(filters, params)),
    [store, filters, initialFilters],
  );

  const resultHandler = useCallback((res: FindResult<Product>) => {
    return setProducts(res.data);
  }, []);

  const [handlePageChange, pagination, showSpinner] = hooks.useAdvancedCall(
    fetcher,
    resultHandler,
    paginationFilters,
  );

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
        items={products}
        renderItem={(item: any) => <ProductCard product={item} />}
        pagination={{
          ...pagination,
          current: pagination.current,
          total: pagination.total || initialProducts.total,
          onChange: (page: number, pageSize: number) => {
            setFilters(setPagination(filters, page, pageSize));
            handlePageChange({
              ...pagination,
              total: pagination.total || initialProducts.total,
              current: page,
              pageSize,
            });
          },
        }}
      />
    </Page>
  );
};
