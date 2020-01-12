import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { FlexGrid } from './FlexGrid';
import { Provider } from '../Provider';

storiesOf('Flex Grid', module).add('standard', () => {
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 2,
    total: 3,
  });

  return (
    <Provider>
      <>
        <FlexGrid
          rowKey='item'
          loading={true}
          dataSource={[{ item: 'a' }, { item: 'b' }, { item: 'c' }]}
          renderItem={(item: any) => <div>{item.item}</div>}
          pagination={{
            ...pagination,
            onChange: (page: number, pageSize: number) =>
              setPagination({ ...pagination, current: page, pageSize }),
          }}
        />
      </>
    </Provider>
  );
});
