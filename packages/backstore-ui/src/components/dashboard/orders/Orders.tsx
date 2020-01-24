import React, { useState } from 'react';
import {
  Flex,
  Title,
  Table,
  Tag,
  Button,
  hooks,
  Tooltip,
  utils,
} from '@sradevski/blocks-ui';
import { ColumnProps } from '@sradevski/blocks-ui/dist/basic/Table';
import compareAsc from 'date-fns/compareAsc';
import format from 'date-fns/format';
import { useSelector } from 'react-redux';
import { getOrders } from '../../../state/modules/orders/orders.selector';
import { sdk } from '@sradevski/la-sdk';
import { getStore } from '../../../state/modules/store/store.selector';
import { setOrders } from '../../../state/modules/orders/orders.module';
import { Order } from '@sradevski/la-sdk/dist/models/order';
import {
  getOrderStatusColor,
  possibleOrderStatuses,
} from '../../shared/utils/statuses';
import { OrderDetailsModal } from './OrderDetailsModal';
import { useTranslation } from 'react-i18next';
import { T } from '../../../config/i18n';

const getColumns = (t: T) =>
  [
    {
      title: t('common.id'),
      dataIndex: '_id',
      render: id => sdk.utils.getShortId(id),
    },
    {
      title: t('product.productCount'),
      dataIndex: 'ordered',
      render: orderList => {
        const orderedProducts = orderList.length;
        return orderedProducts;
      },
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      filters: possibleOrderStatuses.map(status => ({
        text: t(`orderStatus.${status}`),
        value: status,
      })),
      onFilter: (value, record) => record.status === value,
      sorter: (a, b) =>
        t(`orderStatus.${a.status}`).localeCompare(
          t(`orderStatus.${b.status}`),
        ),
      render: status => {
        return (
          <Tag color={getOrderStatusColor(status)}>
            {t(`orderStatus.${status}`)}
          </Tag>
        );
      },
    },
    {
      title: t('order.orderDate'),
      dataIndex: 'createdAt',
      render: date => format(new Date(date), 'MM/dd/yyyy'),
      sorter: (a, b) =>
        compareAsc(new Date(a.createdAt), new Date(b.createdAt)),
    },
  ] as ColumnProps<Order>[];

export const Orders = () => {
  const [orderIdToView, setOrderIdToView] = useState<string>();
  const [total, setTotal] = useState<number | undefined>();
  const store = useSelector(getStore);
  const orders = useSelector(getOrders);
  const { t } = useTranslation();
  const columns = getColumns(t);

  const [caller, showSpinner] = hooks.useCall();
  const [filters, setFilters] = hooks.useFilter(null, {
    storage: 'session',
    storageKey: `${store ? store._id : ''}/orderFilters`,
  });

  React.useEffect(() => {
    if (!store) {
      return;
    }

    caller(
      sdk.order.findForStore(store._id, utils.filter.filtersAsQuery(filters)),
      res => {
        setTotal(res.total);
        return setOrders(res.data);
      },
    );
  }, [store, filters]);

  return (
    <Flex flexDirection='column' px={[3, 3, 3, 4]} py={2}>
      <Title mb={3} level={2}>
        {t('commerce.order_plural')}
      </Title>

      <Flex my={3} justifyContent='flex-end'>
        <Tooltip title='You can do bulk actions using this button.'>
          <Button mx={3} type='ghost'>
            {t('common.action_plural')}
          </Button>
        </Tooltip>
      </Flex>

      <Table<Order>
        dataSource={orders}
        columns={columns}
        loading={showSpinner}
        pagination={{
          total: total || 0,
          current: filters.pagination ? filters.pagination.currentPage : 1,
          pageSize: filters.pagination ? filters.pagination.pageSize : 20,
        }}
        onChange={(pagination, tableFilters, sorter) => {
          setFilters({
            pagination: {
              pageSize: pagination.pageSize || 20,
              currentPage: pagination.current || 1,
            },
            sorting: {
              field: sorter.field,
              order: sorter.order,
            },
            filtering: {
              ...filters.filtering,
              ...utils.filter.multipleItemsFilter(
                'status',
                tableFilters.status,
              ),
            },
          });
        }}
        rowKey='_id'
        onRow={order => ({
          onClick: () => {
            setOrderIdToView(order._id);
          },
        })}
      />

      <OrderDetailsModal
        orderId={orderIdToView}
        onClose={() => setOrderIdToView(undefined)}
      />
    </Flex>
  );
};
