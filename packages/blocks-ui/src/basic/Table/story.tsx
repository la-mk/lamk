import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Table } from './';
import { Provider } from '../../';
import { Text } from '../Text';
import { Button } from '../Button';
import { Trash2 } from 'react-feather';

const columns = [
  {
    title: 'Product',
    key: 'product',
    render: (val: any) => <Text>{val}</Text>,
  },
  {
    title: 'Quantity',
    key: 'quantity',
    isNumeric: true,
    render: (val: any) => val,
  },
  {
    title: 'Total',
    key: 'total',
    isNumeric: true,
    render: (_val: any, item: any) => (
      <Text as="strong" color="primary">
        {item.quantity * item.price} ден
      </Text>
    ),
  },
  {
    key: 'action',
    render: (_val: any, item: any) => (
      <Button
        leftIcon={<Trash2 size={18} />}
        variant="link"
        onClick={() => console.log(item)}
      />
    ),
  },
] as any;

storiesOf('Table', module).add('standard', () => (
  <Provider>
    <div>
      <Table
        rowKey="product"
        columns={columns}
        data={[
          { product: 'Test', quantity: 2, price: 100 },
          { product: 'Test 2', quantity: 3, price: 200 },
        ]}
      />
    </div>
  </Provider>
));
