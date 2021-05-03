import React, { useEffect } from 'react';
import {
  Table as ChakraTable,
  TableProps as ChakraTableProps,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  usePagination,
  ColumnInstance,
} from 'react-table';
import { ArrowDown, ArrowUp, Filter } from 'react-feather';
import { FilterObject } from '../../hooks/useFilter';
import { Text } from '../Text';
import { Box } from '../Box';
import { Pagination } from '../Pagination';
import { Flex } from '../Flex';
import { Input, InputProps } from '../Input';
import { Button } from '../Button';
import { Popover } from '../Popover';

export interface AdvancedTableColumnProps<T extends object> {
  accessor: keyof T;
  disableSortBy?: boolean;
  disableFilters?: boolean;
  isNumeric?: boolean;
  compressed?: boolean;
  Header: ColumnInstance<T>['Header'];
  Cell?: ColumnInstance<T>['Cell'];
  Filter?: ColumnInstance<T>['Filter'];
}

export interface AdvancedTableProps<T extends object> extends ChakraTableProps {
  data: T[];
  columns: AdvancedTableColumnProps<T>[];
  totalData: number;
  onRowClick?: (row: T) => void;
  onFiltersChanged: (filters: FilterObject) => void;
  filtersState?: FilterObject;
  showSearch?: boolean;
  searchProps?: {
    placeholder?: InputProps['placeholder'];
  };
}

const DoubleArrow = () => (
  <Box
    color="gray.400"
    // @ts-ignore
    style={{
      display: 'inline',
      position: 'relative',
      marginRight: '14px',
    }}
  >
    <ArrowUp
      size="12px"
      style={{
        display: 'inline',
        position: 'absolute',
        left: 1,
        top: 2,
      }}
      aria-label="not sorted partial"
    />
    <ArrowDown
      size="12px"
      style={{
        display: 'inline',
        position: 'absolute',
        left: 1,
        top: 6,
      }}
      aria-label="not sorted partial"
    />
  </Box>
);

export const AdvancedTable = <T extends object>({
  data,
  totalData,
  columns,
  onRowClick,
  onFiltersChanged,
  filtersState,
  showSearch,
  searchProps,
}: AdvancedTableProps<T>) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    gotoPage,
    setGlobalFilter,
    state: { globalFilter, sortBy, pageIndex, pageSize, filters },
  } = useTable<T>(
    {
      columns,
      data,
      initialState: {
        filters: filtersState?.filtering
          ? Object.entries(filtersState.filtering).map(([key, f]) => ({
              id: key,
              value: f,
            }))
          : [],
        globalFilter: filtersState?.searching,
        sortBy: filtersState?.sorting
          ? [
              {
                id: filtersState.sorting.field,
                desc: filtersState.sorting.order === 'descend',
              },
            ]
          : [],
        pageIndex: (filtersState?.pagination?.currentPage ?? 1) - 1,
        pageSize: filtersState?.pagination?.pageSize ?? 20,
      },
      pageCount: Math.ceil(
        totalData / (filtersState?.pagination?.pageSize ?? 20)
      ),
      manualSortBy: true,
      manualPagination: true,
      manualFilters: true,
      manualGlobalFilter: true,
      autoResetSortBy: false,
      autoResetPage: false,
      autoResetFilters: false,
      autoResetGlobalFilter: false,
      disableMultiSort: true,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  useEffect(() => {
    onFiltersChanged({
      sorting: sortBy[0]
        ? {
            field: sortBy[0].id,
            order: sortBy[0].desc ? 'descend' : 'ascend',
          }
        : undefined,
      pagination: {
        currentPage: pageIndex + 1,
        pageSize,
      },
      filtering: filters.reduce((agg: any, f) => {
        agg[f.id] = f.value;
        return agg;
      }, {}),
      searching: globalFilter,
    });
  }, [sortBy, pageIndex, pageSize, filters, globalFilter]);

  return (
    <Flex direction="column">
      {showSearch && (
        <Box maxWidth="600px" width={['100%', '60%', '40%']} mx="auto" mb={3}>
          <Input
            mb={3}
            {...searchProps}
            type="search"
            onSearch={setGlobalFilter}
          />
        </Box>
      )}

      {/* @ts-ignore */}
      <Box style={{ overflowX: 'auto' }}>
        <ChakraTable {...getTableProps()}>
          <Thead>
            {headerGroups.map(headerGroup => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    fontWeight="bold"
                    textTransform="none"
                    letterSpacing="normal"
                    style={{
                      width: (column as any).compressed
                        ? '0.0000000001%'
                        : '1%',
                    }}
                  >
                    <Flex
                      align="center"
                      justify={
                        (column as any).isNumeric ? 'flex-end' : 'flex-start'
                      }
                    >
                      <Text as="span" whiteSpace="nowrap">
                        {column.render('Header')}
                        {column.canSort ? (
                          column.isSorted ? (
                            column.isSortedDesc ? (
                              <ArrowDown
                                size="14px"
                                style={{ display: 'inline' }}
                                aria-label="sorted descending"
                              />
                            ) : (
                              <ArrowUp
                                size="14px"
                                style={{ display: 'inline' }}
                                aria-label="sorted ascending"
                              />
                            )
                          ) : (
                            <DoubleArrow />
                          )
                        ) : null}
                      </Text>

                      {column.canFilter && (
                        <Popover
                          trigger={
                            <Button
                              py={1}
                              variant="link"
                              onClick={e => {
                                e.stopPropagation();
                              }}
                              leftIcon={
                                <Filter
                                  size="14px"
                                  style={{ display: 'inline' }}
                                  aria-label="filter"
                                />
                              }
                            />
                          }
                        >
                          {column.render('Filter')}
                        </Popover>
                      )}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <Tr
                  {...row.getRowProps()}
                  sx={{
                    ':hover': {
                      background: 'background.light',
                    },
                  }}
                  style={onRowClick ? { cursor: 'pointer' } : undefined}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.cells.map(cell => (
                    <Td
                      {...cell.getCellProps()}
                      isNumeric={(cell.column as any).isNumeric}
                      style={{
                        width: (cell.column as any).compressed
                          ? '0.0000000001%'
                          : '1%',
                      }}
                    >
                      {cell.render('Cell')}
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </ChakraTable>
      </Box>

      <Pagination
        mt={3}
        ml="auto"
        size="sm"
        totalItems={totalData}
        currentPage={pageIndex + 1}
        pageSize={pageSize}
        onChange={nextPage => gotoPage(nextPage - 1)}
      />
    </Flex>
  );
};
