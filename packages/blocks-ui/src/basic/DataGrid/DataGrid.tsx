import { SpaceProps, Wrap, WrapItem, WrapProps } from '@chakra-ui/react';
import get from 'lodash/get';
import React from 'react';
import { Flex } from '../Flex';
import { Pagination, PaginationProps } from '../Pagination';
import { Spinner } from '../Spinner';

export interface DataGridProps<T>
  extends SpaceProps,
    Pick<WrapProps, 'spacing'> {
  isLoaded?: boolean;
  isFullWidth?: boolean;
  rowKey: keyof T;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  pagination?: PaginationProps;
}

export const DataGrid = <T extends any>({
  rowKey,
  isLoaded,
  isFullWidth,
  items,
  renderItem,
  pagination,
  spacing,
  ...props
}: DataGridProps<T>) => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="space-between"
      width="100%"
      {...props}
    >
      <Spinner isLoaded={isLoaded}>
        <Wrap
          width="100%"
          minHeight={9}
          minWidth={9}
          justify="center"
          spacing={spacing}
        >
          {items.map(entry => {
            return (
              <WrapItem
                width={isFullWidth ? '100%' : undefined}
                key={get(entry, rowKey)}
              >
                {renderItem(entry)}
              </WrapItem>
            );
          })}
        </Wrap>
      </Spinner>

      {pagination && <Pagination mt={6} {...pagination} />}
    </Flex>
  );
};
