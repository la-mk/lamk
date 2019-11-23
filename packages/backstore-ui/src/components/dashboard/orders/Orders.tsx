import React, { useEffect, useState } from 'react';
import { Tooltip } from '@lamk/blocks-ui';
import { Flex, Table, Title, Tag, Button } from '@lamk/blocks-ui';
import { ColumnProps } from '@lamk/blocks-ui/dist/types/basic/Table';
import { useSelector } from 'react-redux';
import { getOrders } from '../../../state/modules/orders/orders.selector';
import { sdk } from '@lamk/la-sdk';
import { getStore } from '../../../state/modules/store/store.selector';
import { setOrders } from '../../../state/modules/orders/orders.module';
import { Order } from '@lamk/la-sdk/dist/models/order';
import { getOrderStatusColor } from '../../shared/utils/statuses';
import { OrderDetailsModal } from './OrderDetailsModal';
import { useCall } from '../../shared/hooks/useCall';
import { FindResult } from '@lamk/la-sdk/dist/setup';
import { useTranslation } from 'react-i18next';
import { T } from '../../../config/i18n';

const getColumns = (t: T) => ([
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
      return <Tag color={getOrderStatusColor(status)}>{t(`order.${status}`)}</Tag>;
    },
  },
  {
    title: t('order.orderDate'),
    dataIndex: 'createdAt',
  },
] as ColumnProps<Order>[]);

export const Orders = () => {
  const [caller, showSpinner] = useCall();
  const [orderIdToView, setOrderIdToView] = useState<string>();
  const store = useSelector(getStore);
  const orders = useSelector(getOrders);
  const {t} = useTranslation();
  const columns = getColumns(t);

  useEffect(() => {
    if (store) {
      caller<FindResult<Order>>(sdk.order.findForStore(store._id), (res) =>
        setOrders(res.data),
      );
    }
  }, [caller, store]);

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
        loading={showSpinner}
        dataSource={orders}
        columns={columns}
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
