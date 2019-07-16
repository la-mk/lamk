import React, { useEffect, useState } from 'react';
import { Tooltip } from '../../../component-lib/basic/Tooltip';
import { Flex } from '../../../component-lib/basic/Flex';
import { Table, ColumnProps } from '../../../component-lib/basic/Table';
import { useSelector, useDispatch } from 'react-redux';
import { getOrders } from '../../../state/modules/orders/orders.selector';
import { sdk } from '../../../sdk';
import { getStore } from '../../../state/modules/store/store.selector';
import { setOrders } from '../../../state/modules/orders/orders.module';
import { message } from '../../../component-lib/static/message';
import { Order } from '../../../sdk/models/order';

interface User {
  name: string;
  age: number;
  address: string;
}

const columns: ColumnProps<Order>[] = [
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
];

export const Orders = () => {
  const [isLoading, setIsLoading] = useState(true);
  const store = useSelector(getStore);
  const orders = useSelector(getOrders);
  const dispatch = useDispatch();

  useEffect(() => {
    sdk.order
      .findForStore(store._id)
      .then(orders => {
        dispatch(setOrders(orders.data));
      })
      .catch(err => message.error(err.message))
      .finally(() => setIsLoading(false));
  }, [dispatch, store]);

  return (
    <Flex flexDirection='column' px={[3, 3, 3, 4]} py={4}>
      <Tooltip mb={2} title='You can see all orders here.'>
        Orders
      </Tooltip>
      <Table<Order> loading={isLoading} dataSource={orders} columns={columns} />
    </Flex>
  );
};
