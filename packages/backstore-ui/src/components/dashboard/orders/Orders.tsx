import React, { useState, useCallback, useMemo } from 'react';
import { Tooltip } from '@sradevski/blocks-ui';
import { Flex, Title, Table, Tag, Button, hooks } from '@sradevski/blocks-ui';
import { ColumnProps } from '@sradevski/blocks-ui/dist/types/basic/Table';
import { useSelector } from 'react-redux';
import { getOrders } from '../../../state/modules/orders/orders.selector';
import { sdk } from '@sradevski/la-sdk';
import { getStore } from '../../../state/modules/store/store.selector';
import { setOrders } from '../../../state/modules/orders/orders.module';
import { Order } from '@sradevski/la-sdk/dist/models/order';
import { getOrderStatusColor } from '../../shared/utils/statuses';
import { OrderDetailsModal } from './OrderDetailsModal';
import { useTranslation } from 'react-i18next';
import { T } from '../../../config/i18n';
import { FindResult } from '@sradevski/la-sdk/dist/setup';

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
    },
  ] as ColumnProps<Order>[];

export const Orders = () => {
  const [orderIdToView, setOrderIdToView] = useState<string>();
  const store = useSelector(getStore);
  const orders = useSelector(getOrders);
  const { t } = useTranslation();
  const columns = getColumns(t);

  const fetcher = useMemo(
    () =>
      store ? (params: any) => sdk.order.findForStore(store._id, params) : null,
    [store],
  );

  const resultHandler = useCallback((res: FindResult<Order>) => {
    return setOrders(res.data);
  }, []);

  const [handlePageChange, pagination, showSpinner] = hooks.useAdvancedCall(
    fetcher,
    resultHandler,
  );

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
        pagination={pagination}
        onChange={handlePageChange}
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
