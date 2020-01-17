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
  items: Array<T>;
  renderItem: any;
  pagination: PaginationProps;
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
    <Flex flexDirection='column' alignItems='center' width='100%'>
      <Spin spinning={loading}>
        <Flex
          className={className}
          justifyContent='center'
          alignItems='center'
          flexWrap='wrap'
          flexDirection='row'
        >
          {items.map((entry: any) => {
            return <Box key={entry[rowKey]}>{renderItem(entry)}</Box>;
          })}
        </Flex>
      </Spin>
      {pagination && <Pagination {...pagination} />}
    </Flex>
  );
};

export const FlexGrid = system<any>(FlexGridBase as any);
