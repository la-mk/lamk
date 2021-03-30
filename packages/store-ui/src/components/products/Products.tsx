import React, { useEffect, useState } from 'react';
import {
  DataGrid,
  hooks,
  utils,
  Flex,
  Box,
  Drawer,
  Button,
  Divider,
  Result,
} from '@la-mk/blocks-ui';
import { Filter } from 'react-feather';
import { ProductCard } from '../shared/product/ProductCard';
import { Page } from '../shared/Page';
import { Product } from '@la-mk/la-sdk/dist/models/product';
import { useTranslation } from '../../common/i18n';
import { FindResult } from '@la-mk/la-sdk/dist/setup';
import { sdk } from '@la-mk/la-sdk';
import { useSelector } from 'react-redux';
import { getStore } from '../../state/modules/store/store.selector';
import { FilterObject } from '@la-mk/blocks-ui/dist/hooks/useFilter';
import { ProductsSidemenu } from './ProductsSidemenu';
import { filterRouter } from '../../common/filterUtils';
import { useBreadcrumb } from '../shared/hooks/useBreadcrumb';
import { SortFilter } from '../shared/Filters/SortFilter';

interface ProductsProps {
  initialProducts: FindResult<Product>;
  initialFilters?: FilterObject;
}

export const Products = ({
  initialProducts,
  initialFilters = {},
}: ProductsProps) => {
  const { t } = useTranslation();
  const store = useSelector(getStore);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [products, setProducts] = useState(initialProducts);
  const paginationSize = hooks.useBreakpoint<'sm' | 'md'>(['sm', 'md', 'md']);
  const [caller, showSpinner] = hooks.useCall();

  // TODO: There is no clear way to reset filters that are not part of the sidemenu as of now, nor filters that don't apply when searching.
  const [filters, setFilters] = hooks.useFilter(initialFilters, {
    storage: 'url',
    router: filterRouter,
  });

  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  useBreadcrumb([
    { url: '/', title: t('pages.home') },
    { url: '/products', title: t('pages.product_plural') },
  ]);

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
    <Page>
      <Flex direction={['column', 'column', 'row']}>
        <ProductsSidemenu
          height='100%'
          display={['none', 'none', 'initial']}
          mr={3}
          filters={filters}
          setFilters={setFilters}
        />
        {/* The drawer is always visible, but the button to toggle it is only visible on mobile. The only time this is somewhat of an issue is when opening the modal, and then resizing the window, but even then the experience is pretty good. */}
        <Drawer
          size='sm'
          title={t('common.filter_plural')}
          isOpen={isDrawerVisible}
          onClose={() => setIsDrawerVisible(false)}
          placement='left'
        >
          <ProductsSidemenu pt={3} filters={filters} setFilters={setFilters} />
        </Drawer>

        <Box mb={2} display={['initial', 'initial', 'none']}>
          <Flex direction='column' align='center' justify='center'>
            <Button
              size='lg'
              variant='ghost'
              leftIcon={<Filter size='1.2rem' />}
              onClick={() => setIsDrawerVisible(true)}
            >
              {t('common.filter_plural')}
            </Button>
            <Divider my={3} />
          </Flex>
        </Box>

        <Flex
          width='100%'
          direction='column'
          align='center'
          justify='flex-start'
        >
          <Box mb={7}>
            <SortFilter filters={filters} onChange={setFilters} />
          </Box>

          {products.total === 0 && (
            <Result
              status='empty'
              description={t('product.noMatchingProduct_plural')}
            />
          )}
          {products.total > 0 && (
            <DataGrid
              spacing={[4, 6, 6]}
              isLoaded={!showSpinner}
              rowKey='_id'
              items={products.data}
              renderItem={(item: any) => (
                <ProductCard product={item} storeId={store._id} />
              )}
              pagination={{
                size: paginationSize,
                currentPage: filters.pagination?.currentPage ?? 1,
                pageSize: filters.pagination?.pageSize ?? 20,
                totalItems: products.total,
                onChange: (currentPage: number, pageSize: number) => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setFilters({
                    ...filters,
                    pagination: { currentPage, pageSize },
                  });
                },
              }}
            />
          )}
        </Flex>
      </Flex>
    </Page>
  );
};
