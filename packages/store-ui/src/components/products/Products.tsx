import React, { useState } from 'react';
import {
  FlexGrid,
  hooks,
  utils,
  Flex,
  Box,
  Drawer,
  Button,
  Card,
  Divider,
} from '@sradevski/blocks-ui';
import { ProductCard } from '../ProductCard';
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
  const [filters, setFilters] = hooks.useFilter(initialFilters, {
    storage: 'url',
    router: filterRouter,
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
    <Page
      title={
        filters.searching
          ? // TODO: Translate
            `${t('pages.product_plural')} for '${filters.searching}'`
          : t('pages.product_plural')
      }
    >
      <Flex flexDirection={['column', 'column', 'row']}>
        <Card mr={2} display={['none', 'none', 'initial']}>
          <ProductsSidemenu
            filters={filters || initialFilters}
            setFilters={setFilters}
          />
        </Card>
        {/* The drawer is always visible, but the button to toggle it is only visible on mobile. The only time this is somewhat of an issue is when opening the modal, and then resizing the window, but even then the experience is pretty good. */}
        <Drawer
          width={320}
          visible={isDrawerVisible}
          onClose={() => setIsDrawerVisible(false)}
          closable
          placement='left'
        >
          <ProductsSidemenu
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
              size='large'
              type='link'
              icon='filter'
              onClick={() => setIsDrawerVisible(true)}
            >
              {t('common.filter_plural')}
            </Button>
            <Divider />
          </Flex>
        </Box>
        <FlexGrid
          loading={showSpinner}
          rowKey='_id'
          items={products.data}
          renderItem={(item: any) => (
            <Box mx={[1, 2, 2]} mb={[2, 3, 3]}>
              <ProductCard product={item} storeId={store._id} />
            </Box>
          )}
          pagination={{
            current: filters.pagination ? filters.pagination.currentPage : 1,
            pageSize: filters.pagination ? filters.pagination.pageSize : 20,
            total: products.total,
            onChange: (currentPage: number, pageSize: number) => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setFilters({ ...filters, pagination: { currentPage, pageSize } });
            },
          }}
        />
      </Flex>
    </Page>
  );
};
