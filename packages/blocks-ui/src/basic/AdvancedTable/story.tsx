import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { AdvancedTable, AdvancedTableColumnProps } from '.';
import { Provider, Flex, CheckboxGroup, Checkbox } from '../..';

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
        disableSortBy: true,
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
          return (
            <CheckboxGroup
              value={[column.filterValue]}
              onChange={vals => {
                return column.setFilter(vals);
              }}
            >
              <Flex direction="column">
                {['first', 'second', 'third'].map(status => (
                  <Checkbox key={status} my={1} value={status}>
                    {status}
                  </Checkbox>
                ))}
              </Flex>
            </CheckboxGroup>
          );
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
