import React from 'react';
import { Flex } from '../Flex';
import { system } from '../../system';
import { Pagination } from '../Pagination';
import { PaginationProps } from 'antd/es/pagination';
import { Spinner } from '../Spinner';

export interface FlexGridProps<T> {
  className?: string;
  rowKey: string;
  loading?: boolean;
  items: Array<T>;
  renderItem: any;
  pagination?: PaginationProps;
}

const FlexGridBase = <T extends any>({
  className,
  rowKey,
  loading,
  items,
  renderItem,
  pagination,
}: FlexGridProps<T>) => {
  return (
    <Flex direction="column" align="center" width="100%">
      {loading ? (
        <Spinner mb={4} />
      ) : (
        <Flex
          className={className}
          justify="center"
          align="center"
          wrap="wrap"
          direction="row"
          mb={4}
        >
          {items.map((entry: any) => {
            return (
              <React.Fragment key={entry[rowKey]}>
                {renderItem(entry)}
              </React.Fragment>
            );
          })}
        </Flex>
      )}

      {pagination && <Pagination {...pagination} />}
    </Flex>
  );
};

export const FlexGrid = system<FlexGridProps<any>>(FlexGridBase);
