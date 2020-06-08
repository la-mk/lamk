import React, { useState } from 'react';
import { List, Empty, hooks, utils } from '@sradevski/blocks-ui';
import { Order } from '@sradevski/la-sdk/dist/models/order';
import { sdk } from '@sradevski/la-sdk';
import { Page } from '../shared/Page';
import { useSelector } from 'react-redux';
import { getUser } from '../../state/modules/user/user.selector';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { useTranslation } from '../../common/i18n';
import { getStore } from '../../state/modules/store/store.selector';
import Router from 'next/router';
import { useBreadcrumb } from '../shared/hooks/useBreadcrumb';
import { OrderDescription } from './OrderDescription';
import { CustomCard } from '../shared/components/CustomCard';

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
    },
    {
      storage: 'url',
      router: Router,
    },
  );

  useBreadcrumb([
    { url: '/', title: t('pages.home') },
    { url: '/orders', title: t('pages.order_plural') },
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
    return <Empty mt={6} description={t('order.orderNotFound_plural')}></Empty>;
  }

  return (
    <Page>
      <List<Order>
        style={{ width: '100%' }}
        pagination={{
          current: filters.pagination ? filters.pagination.currentPage : 1,
          pageSize: filters.pagination ? filters.pagination.pageSize : 10,
          total: orders ? orders.total : 0,
          showSizeChanger: false,
          onChange: (currentPage, pageSize) =>
            setFilters({ ...filters, pagination: { currentPage, pageSize } }),
        }}
        loading={showSpinner}
        dataSource={orders ? orders.data : []}
        renderItem={order => (
          <CustomCard mx='auto' mb={5} maxWidth={960}>
            <OrderDescription order={order} storeId={store._id} />
          </CustomCard>
        )}
      ></List>
    </Page>
  );
};
