import React, { useState } from 'react';
import {
  Flex,
  Tag,
  hooks,
  utils,
  AdvancedTableColumnProps,
  AdvancedTable,
  Spinner,
} from '@la-mk/blocks-ui';
import format from 'date-fns/format';
import { useSelector } from 'react-redux';
import { getOrders } from '../../../state/modules/orders/orders.selector';
import { sdk } from '@la-mk/la-sdk';
import { getStore } from '../../../state/modules/store/store.selector';
import { setOrders } from '../../../state/modules/orders/orders.module';
import { Order } from '@la-mk/la-sdk/dist/models/order';
import { OrderDetailsModal } from './OrderDetailsModal';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { getFilter } from '../../shared/utils/table';

const getColumns = (t: TFunction): AdvancedTableColumnProps<Order>[] => [
  {
    Header: t('common.id'),
    accessor: '_id',
    disableSortBy: true,
    disableFilters: true,
    Cell: ({ value }: any) => sdk.utils.getShortId(value),
  },
  {
    Header: t('finance.total'),
    accessor: 'calculatedTotal',
    disableFilters: true,
    Cell: ({ value, row }: any) =>
      `${value} ${t(`currencies.${row.original.currency}`)}`,
  },
  {
    Header: t('common.status'),
    accessor: 'status',
    Cell: ({ value }: any) => {
      return (
        <Tag
          // @ts-ignore
          style={{ verticalAlign: 'middle' }}
          size='sm'
          // @ts-ignore
          bgColor={sdk.order.orderStatusColor[value]}
        >
          {t(`orderStatus.${value}`)}
        </Tag>
      );
    },
    Filter: ({ column }: any) =>
      getFilter(
        column,
        'status',
        Object.values(sdk.order.OrderStatus).map(status => ({
          title: t(`orderStatus.${status}`),
          value: status,
        })),
      ),
  },
  {
    Header: t('order.orderDate'),
    accessor: 'createdAt',
    disableFilters: true,
    Cell: ({ value }: any) => format(new Date(value), 'MM/dd/yyyy'),
  },
];

let prevOrders: any = [];

export const Orders = () => {
  const [orderIdToView, setOrderIdToView] = useState<string>();
  const [total, setTotal] = useState<number | undefined>();
  const store = useSelector(getStore);
  const orders = useSelector(getOrders);
  const { t } = useTranslation();

  const [caller, showSpinner] = hooks.useCall();
  const [filters, setFilters] = hooks.useFilter(
    {
      filtering: { status: undefined },
      sorting: { field: 'createdAt', order: 'descend' },
    },
    {
      storage: 'session',
      storageKey: `${store ? store._id : ''}/orderFilters`,
    },
  );
  const columns = React.useMemo(() => getColumns(t), [t]);

  React.useEffect(() => {
    console.log(orders === prevOrders);
    prevOrders = orders;
  }, [orders]);

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
  }, [store, filters, caller]);

  return (
    <Flex direction='column' px={[3, 4, 5]} py={5}>
      <Spinner isLoaded={!showSpinner}>
        <AdvancedTable
          data={orders}
          columns={columns}
          totalData={total ?? 0}
          filtersState={filters}
          onFiltersChanged={setFilters}
          onRowClick={order => {
            setOrderIdToView(order._id);
          }}
        />
      </Spinner>

      <OrderDetailsModal
        orderId={orderIdToView}
        onClose={() => setOrderIdToView(undefined)}
      />
    </Flex>
  );
};
