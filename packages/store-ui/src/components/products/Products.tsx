import React, { useState } from 'react';
import {
  FlexGrid,
  hooks,
  utils,
  Flex,
  Box,
  Drawer,
  Button,
  Divider,
  Empty,
} from '@sradevski/blocks-ui';
import { FilterOutlined } from '@ant-design/icons';
import { ProductCard } from '../shared/product/ProductCard';
import { Page } from '../shared/Page';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { useTranslation } from '../../common/i18n';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { sdk } from '@sradevski/la-sdk';
import { useSelector } from 'react-redux';
import { getStore } from '../../state/modules/store/store.selector';
import { FilterObject } from '@sradevski/blocks-ui/dist/hooks/useFilter';
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
  initialFilters = new Object(),
}: ProductsProps) => {
  const { t } = useTranslation();
  const store = useSelector(getStore);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [products, setProducts] = useState(initialProducts);
  const [caller, showSpinner] = hooks.useCall();

  // TODO: There is no clear way to reset filters that are not part of the sidemenu as of now, nor filters that don't apply when searching.
  const [filters, setFilters] = hooks.useFilter(initialFilters, {
    storage: 'url',
    router: filterRouter,
  });

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
      <Flex flexDirection={['column', 'column', 'row']}>
        <ProductsSidemenu
          height='100%'
          display={['none', 'none', 'initial']}
          mr={2}
          filters={filters || initialFilters}
          setFilters={setFilters}
        />
        {/* The drawer is always visible, but the button to toggle it is only visible on mobile. The only time this is somewhat of an issue is when opening the modal, and then resizing the window, but even then the experience is pretty good. */}
        <Drawer
          width={320}
          visible={isDrawerVisible}
          onClose={() => setIsDrawerVisible(false)}
          closable
          placement='left'
        >
          <ProductsSidemenu
            pt={3}
            filters={filters || initialFilters}
            setFilters={setFilters}
          />
        </Drawer>

        <Box mb={2} display={['initial', 'initial', 'none']}>
          <Flex
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
          >
            <Button
              size='lg'
              variant='link'
              leftIcon={<FilterOutlined />}
              onClick={() => setIsDrawerVisible(true)}
            >
              {t('common.filter_plural')}
            </Button>
            <Divider />
          </Flex>
        </Box>

        <Flex
          width='100%'
          flexDirection='column'
          alignItems='center'
          justifyContent='flex-start'
        >
          <Box mb={6}>
            <SortFilter
              filters={filters || initialFilters}
              onChange={setFilters}
            />
          </Box>

          {products.total === 0 && (
            <Empty description={t('product.noMatchingProduct_plural')} />
          )}
          {products.total > 0 && (
            <FlexGrid
              loading={showSpinner}
              rowKey='_id'
              items={products.data}
              renderItem={(item: any) => (
                <Box mx={[1, 2, 2]} mb={'auto'}>
                  <ProductCard product={item} storeId={store._id} />
                </Box>
              )}
              pagination={{
                current: filters.pagination
                  ? filters.pagination.currentPage
                  : 1,
                pageSize: filters.pagination ? filters.pagination.pageSize : 20,
                total: products.total,
                showSizeChanger: false,
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
