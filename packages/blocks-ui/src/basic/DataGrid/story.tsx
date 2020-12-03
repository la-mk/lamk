import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { DataGrid } from './DataGrid';
import { Provider } from '../Provider';
import { Box } from '../Box';
import { Flex } from '../Flex';

storiesOf('DataGrid', module).add('standard', () => {
  const [pagination, setPagination] = React.useState({
    currentPage: 1,
    pageSize: 2,
    totalItems: 3,
  });

  return (
    <Provider>
      <Flex width="100%" direction="column" align="center">
        <DataGrid
          spacing={5}
          rowKey="item"
          isLoaded={true}
          items={[{ item: 'a' }, { item: 'b' }, { item: 'c' }]}
          renderItem={(item: any) => (
            <Box bg="tomato" height="80px" width="220px">
              {item.item}
            </Box>
          )}
          pagination={{
            ...pagination,
            onChange: (page, pageSize) =>
              setPagination({
                ...pagination,
                currentPage: page,
                pageSize: pageSize ?? 20,
              }),
          }}
        />

        <DataGrid
          mt={8}
          spacing={5}
          isFullWidth
          rowKey="item"
          isLoaded={true}
          items={[{ item: 'a' }, { item: 'b' }, { item: 'c' }]}
          renderItem={(item: any) => (
            <Box bg="tomato" height="80px" width="100%">
              {item.item}
            </Box>
          )}
          pagination={{
            ...pagination,
            onChange: (page, pageSize) =>
              setPagination({
                ...pagination,
                currentPage: page,
                pageSize: pageSize ?? 20,
              }),
          }}
        />
      </Flex>
    </Provider>
  );
});
