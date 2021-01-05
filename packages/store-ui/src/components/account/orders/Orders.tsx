import React, { useState } from 'react';
import { DataGrid, Result, hooks, utils } from '@la-mk/blocks-ui';
import { Order } from '@la-mk/la-sdk/dist/models/order';
import { sdk } from '@la-mk/la-sdk';
import { Page } from '../../shared/Page';
import { useSelector } from 'react-redux';
import { getUser } from '../../../state/modules/user/user.selector';
import { FindResult } from '@la-mk/la-sdk/dist/setup';
import { useTranslation } from '../../../common/i18n';
import { getStore } from '../../../state/modules/store/store.selector';
import Router from 'next/router';
import { useBreadcrumb } from '../../shared/hooks/useBreadcrumb';
import { OrderDescription } from './OrderDescription';
import { CustomCard } from '../../shared/components/CustomCard';
import { BackButton } from '../BackButton';

export const Orders = () => {
  const [orders, setOrders] = useState<FindResult<Order> | null>(null);
  const user = useSelector(getUser);
  const store = useSelector(getStore);
  const { t } = useTranslation();
  const [caller, showSpinner] = hooks.useCall();
  const [filters, setFilters] = hooks.useFilter(
    {
      sorting: {
        field: 'createdAt',
        order: 'descend',
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
      },
    },
    {
      storage: 'url',
      router: Router,
    },
  );

  useBreadcrumb([
    { url: '/', title: t('pages.home') },
    { url: '/account/orders', title: t('pages.order_plural') },
  ]);

  React.useEffect(() => {
    if (!user) {
      return;
    }

    caller(
      sdk.order.findForUserFromStore(
        user._id,
        store._id,
        utils.filter.filtersAsQuery(filters),
      ),
      setOrders,
    );
  }, [user, filters]);

  if (orders && orders.total === 0) {
    return (
      <Result
        status='empty'
        mt={8}
        description={t('order.orderNotFound_plural')}
      />
    );
  }

  return (
    <Page maxWidth={'86rem'}>
      <BackButton />
      <DataGrid<Order>
        isFullWidth
        rowKey={'_id'}
        spacing={8}
        pagination={{
          currentPage: filters.pagination ? filters.pagination.currentPage : 1,
          pageSize: filters.pagination ? filters.pagination.pageSize : 10,
          totalItems: orders ? orders.total : 0,
          onChange: (currentPage, pageSize) => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setFilters({
              ...filters,
              pagination: { currentPage, pageSize },
            });
          },
        }}
        isLoaded={!showSpinner}
        items={orders ? orders.data : []}
        renderItem={order => (
          <CustomCard mx='auto' width='100%'>
            <OrderDescription order={order} storeId={store._id} />
          </CustomCard>
        )}
      ></DataGrid>
    </Page>
  );
};
