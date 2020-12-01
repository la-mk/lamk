import { SpaceProps, Wrap, WrapItem, WrapProps } from '@chakra-ui/react';
import React from 'react';
import { Flex } from '../Flex';
import { Pagination, PaginationProps } from '../Pagination';
import { Spinner } from '../Spinner';

export interface DataGridProps<T>
  extends SpaceProps,
    Pick<WrapProps, 'spacing'> {
  isLoaded?: boolean;
  rowKey: keyof T;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  pagination?: PaginationProps;
}

export const DataGrid = <T extends any>({
  rowKey,
  isLoaded,
  items,
  renderItem,
  pagination,
  spacing,
  ...props
}: DataGridProps<T>) => {
  return (
    <Flex
      minHeight={'100px'}
      direction="column"
      align="center"
      justify="space-between"
      width="100%"
      {...props}
    >
      {!isLoaded ? (
        <Spinner isLoaded={isLoaded} />
      ) : (
        <Wrap align="center" justify="center" spacing={spacing}>
          {items.map((entry: any) => {
            return <WrapItem key={entry[rowKey]}>{renderItem(entry)}</WrapItem>;
          })}
        </Wrap>
      )}

      {pagination && <Pagination mt={6} {...pagination} />}
    </Flex>
  );
};
