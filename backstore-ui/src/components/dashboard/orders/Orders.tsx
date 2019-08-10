import React, { useEffect, useState } from 'react';
import { Tooltip } from 'blocks-ui';
import { Flex, Table, Title, Tag, Button, message } from 'blocks-ui';
import { ColumnProps } from 'blocks-ui/dist/types/basic/Table';
import { useSelector, useDispatch } from 'react-redux';
import { getOrders } from '../../../state/modules/orders/orders.selector';
import { sdk } from 'la-sdk';
import { getStore } from '../../../state/modules/store/store.selector';
import { setOrders } from '../../../state/modules/orders/orders.module';
import { Order } from 'la-sdk/dist/models/order';
import { getShortId } from '../../shared/utils/ids';
import { getOrderStatusColor } from '../../shared/utils/statuses';
import { OrderDetailsModal } from './OrderDetailsModal';

const columns: ColumnProps<Order>[] = [
  {
    title: 'Id',
    dataIndex: '_id',
    render: id => getShortId(id),
  },
  {
    title: 'Product Count',
    dataIndex: 'ordered',
    render: orderList => {
      const orderedProducts = orderList.length;
      return orderedProducts;
    },
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: status => {
      return <Tag color={getOrderStatusColor(status)}>{status}</Tag>;
    },
  },
  {
    title: 'Order date',
    dataIndex: 'createdAt',
  },
];

export const Orders = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [orderIdToView, setOrderIdToView] = useState<string>();
  const store = useSelector(getStore);
  const orders = useSelector(getOrders);
  const dispatch = useDispatch();

  useEffect(() => {
    if (store._id) {
      setShowSpinner(true);
      sdk.order
        .findForStore(store._id)
        .then(orders => {
          dispatch(setOrders(orders.data));
        })
        .catch(err => message.error(err.message))
        .finally(() => setShowSpinner(false));
    }
  }, [dispatch, store]);

  return (
    <Flex flexDirection='column' px={[3, 3, 3, 4]} py={2}>
      <Title mb={3} level={2}>
        Orders
      </Title>

      <Flex my={3} justifyContent='flex-end'>
        <Tooltip title='You can do bulk actions using this button.'>
          <Button mx={3} type='ghost'>
            Actions
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
