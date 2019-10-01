import React from 'react';
import { Flex } from './Flex';
import styled from 'styled-components';
import { system } from '../system';
import { Pagination } from './Pagination';

const Box = styled.div`
  margin: 0 ${props => props.theme.space[4]}px
    ${props => props.theme.space[3]}px;
`;

const FlexGridBase = ({
  className,
  rowKey,
  dataSource,
  totalItems,
  renderItem,
}: any) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 30;

  const slice = dataSource.slice(
    (currentPage - 1) * itemsPerPage,
    (currentPage - 1) * itemsPerPage + itemsPerPage,
  );

  return (
    <Flex flexDirection='column' alignItems='center' width='100%'>
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
      <Pagination
        total={totalItems}
        onChange={page => setCurrentPage(page)}
        current={currentPage}
        defaultPageSize={itemsPerPage}
      />
    </Flex>
  );
};

export const FlexGrid = system<any>(FlexGridBase as any);
