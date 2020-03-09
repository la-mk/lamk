import sum from 'lodash/sum';
import React, { useState } from 'react';
import {
  Flex,
  Title,
  Table,
  Tag,
  hooks,
  Tooltip,
  utils,
  Text,
} from '@sradevski/blocks-ui';
import { ColumnProps } from '@sradevski/blocks-ui/dist/basic/Table';
import compareAsc from 'date-fns/compareAsc';
import format from 'date-fns/format';
import { useSelector } from 'react-redux';
import { getOrders } from '../../../state/modules/orders/orders.selector';
import { sdk } from '@sradevski/la-sdk';
import { getStore } from '../../../state/modules/store/store.selector';
import { setOrders } from '../../../state/modules/orders/orders.module';
import { Order, OrderItem } from '@sradevski/la-sdk/dist/models/order';
import { getOrderStatusColor } from '../../shared/utils/enums';
import { OrderDetailsModal } from './OrderDetailsModal';
import { useTranslation } from 'react-i18next';
import { T } from '../../../config/i18n';
import { FilterObject } from '@sradevski/blocks-ui/dist/hooks/useFilter';

const getColumns = (t: T, filters: FilterObject) =>
  [
    {
      title: t('common.id'),
      dataIndex: '_id',
      render: id => sdk.utils.getShortId(id),
    },
    {
      title: t('finance.total'),
      dataIndex: 'ordered',
      render: (_orderList: OrderItem[], order: Order) => {
        const prices = sdk.utils.pricing.calculatePrices(
          order.ordered,
          order.delivery,
        );
        return <Text>{prices.total} ден</Text>;
      },
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      filteredValue:
        filters.filtering?.status?.$in ??
        (filters.filtering?.status ? [filters.filtering?.status] : []),
      filters: Object.values(sdk.order.OrderStatus).map(status => ({
        text: t(`orderStatus.${status}`),
        value: status,
      })),
      onFilter: (value, record) => record.status === value,
      sortOrder:
        filters.sorting?.field === 'status' ? filters.sorting.order : undefined,
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
      sortOrder:
        filters.sorting?.field === 'createdAt'
          ? filters.sorting.order
          : undefined,
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

  const [caller, showSpinner] = hooks.useCall();
  const [filters, setFilters] = hooks.useFilter(null, {
    storage: 'session',
    storageKey: `${store ? store._id : ''}/orderFilters`,
  });
  const columns = getColumns(t, filters);

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
    <Flex flexDirection='column' px={[3, 3, 4]} py={2}>
      <Title mb={3} level={2}>
        {t('commerce.order_plural')}
      </Title>

      <Flex my={3} justifyContent='flex-end'>
        <Tooltip title='You can do bulk actions using this button.'>
          {/* <Button mx={3} type='ghost'>
            {t('common.action_plural')}
          </Button> */}
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
            sorting:
              sorter.field && sorter.order
                ? {
                    field: sorter.field,
                    order: sorter.order,
                  }
                : undefined,
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
