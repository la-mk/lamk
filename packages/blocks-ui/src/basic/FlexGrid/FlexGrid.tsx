import React from 'react';
import { Flex } from '../Flex';
import styled from 'styled-components';
import { system } from '../../system';
import { Pagination } from '../Pagination';
import { PaginationProps } from 'antd/es/pagination';
import { Spin } from '../Spin';

const Box = styled.div`
  margin: 0 ${props => props.theme.space[4]}px
    ${props => props.theme.space[3]}px;
`;

export interface FlexGridProps<T> {
  className?: string;
  rowKey: string;
  loading?: boolean;
  dataSource: Array<T>;
  renderItem: any;
  pagination: PaginationProps;
}

const FlexGridBase = <T extends any>({
  className,
  rowKey,
  loading,
  dataSource,
  renderItem,
  pagination,
}: FlexGridProps<T>) => {
  const itemsPerPage = pagination?.pageSize ?? 20;
  const currentPage = pagination?.current ?? 1;

  const slice = dataSource.slice(
    (currentPage - 1) * itemsPerPage,
    (currentPage - 1) * itemsPerPage + itemsPerPage,
  );

  return (
    <Flex flexDirection='column' alignItems='center' width='100%'>
      <Spin spinning={loading}>
        <Flex
          className={className}
          justifyContent='center'
          alignItems='center'
          flexWrap='wrap'
          flexDirection='row'
        >
          {slice.map((entry: any) => {
            return <Box key={entry[rowKey]}>{renderItem(entry)}</Box>;
          })}
        </Flex>
      </Spin>
      {pagination && <Pagination {...pagination} />}
    </Flex>
  );
};

export const FlexGrid = system<any>(FlexGridBase as any);
