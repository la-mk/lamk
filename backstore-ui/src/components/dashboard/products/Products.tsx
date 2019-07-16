import React from 'react';
import { Tooltip } from '../../../component-lib/basic/Tooltip';
import { Flex } from '../../../component-lib/basic/Flex';
import { Table, ColumnProps } from '../../../component-lib/basic/Table';

interface User {
  name: string;
  age: number;
  address: string;
}

const data: User[] = [
  {
    name: 'Mike',
    age: 32,
    address: '10 Downing Street',
  },
  {
    name: 'John',
    age: 42,
    address: '10 Downing Street',
  },
];

const columns: ColumnProps<User>[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
];

export const Products = () => {
  return (
    <Flex flexDirection='column' px={[3, 3, 3, 4]} py={4}>
      <Tooltip mb={2} title='You can see all products here.'>
        Products
      </Tooltip>
      <Table<User> dataSource={data} columns={columns} />
    </Flex>
  );
};
