import React from 'react';
import {
  Table as ChakraTable,
  TableProps as ChakraTableProps,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  SpaceProps,
} from '@chakra-ui/react';
import { InputSize, TableVariant } from 'system';

export interface TableColumnProps<T> {
  title: string;
  key: keyof T;
  isNumeric?: boolean;
  render: (val: any, item: T) => React.ReactNode;
}

export interface TableProps<T>
  extends Pick<ChakraTableProps, 'display'>,
    SpaceProps {
  variant?: TableVariant;
  size?: InputSize;
  columns: TableColumnProps<T>[];
  data: T[] | undefined;
}

export const Table = <T extends { [key: string]: any }>({
  columns,
  data,
  ...props
}: TableProps<T>) => {
  return (
    <ChakraTable colorScheme="primary" {...props}>
      <Thead>
        <Tr>
          {columns.map(column => {
            return <Th isNumeric={column.isNumeric}>{column.title}</Th>;
          })}
        </Tr>
      </Thead>
      <Tbody>
        {data?.map(entry => {
          return (
            <Tr>
              {columns.map(column => {
                return (
                  <Td isNumeric={column.isNumeric}>
                    {column.render?.(entry[column.key], entry) ??
                      entry[column.key]}
                  </Td>
                );
              })}
            </Tr>
          );
        })}
      </Tbody>
    </ChakraTable>
  );
};
