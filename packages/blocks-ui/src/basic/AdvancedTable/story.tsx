import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { AdvancedTable, AdvancedTableColumnProps } from '.';
import { Provider } from '../..';

storiesOf('AdvancedTable', module).add('standard', () => {
  const data = React.useMemo(
    () => [
      {
        fromUnit: 'inches',
        toUnit: 'millimetres (mm)',
        factor: 25.4,
      },
      {
        fromUnit: 'feet',
        toUnit: 'centimetres (cm)',
        factor: 30.48,
      },
      {
        fromUnit: 'yards',
        toUnit: 'metres (m)',
        factor: 0.91444,
      },
    ],
    []
  );

  const columns: AdvancedTableColumnProps<any>[] = React.useMemo(
    () => [
      {
        Header: 'To convert',
        accessor: 'fromUnit',
        canSort: false,
        disableFilters: true,
      },
      {
        Header: 'Into',
        accessor: 'toUnit',
        Filter: 'Hey',
      },
      {
        Header: 'Multiply by',
        accessor: 'factor',
        isNumeric: true,
        Filter: ({ column }) => {
          console.log(column.filterValue);
          if (!column.filterValue) {
            column.setFilter('test');
          }

          return 'Heyy';
        },
      },
    ],
    []
  );

  return (
    <Provider>
      <div>
        <AdvancedTable
          totalData={3}
          columns={columns}
          data={data}
          showSearch
          onFiltersChanged={console.log}
          onRowClick={console.log}
          filtersState={{
            pagination: {
              pageSize: 2,
              currentPage: 2,
            },
          }}
        />
      </div>
    </Provider>
  );
});
