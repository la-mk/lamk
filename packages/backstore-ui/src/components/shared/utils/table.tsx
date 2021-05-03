import React from 'react';
import { Box, Checkbox, CheckboxGroup, Flex, utils } from '@la-mk/blocks-ui';

export const getFilter = (
  column: any,
  key: string,
  options: { title: string; value: string }[],
) => {
  let val = column.filterValue;
  if (!val) {
    val = [];
  } else if (typeof val === 'string') {
    val = [val];
  } else {
    val = val.$in;
  }

  if (options.length === 0) {
    return <Box minHeight='2rem'>/</Box>;
  }

  return (
    <Box minHeight='2rem' maxHeight='24rem' overflow='auto'>
      <CheckboxGroup
        value={val}
        onChange={vals => {
          return column.setFilter(
            utils.filter.multipleItemsFilter(key, vals)[key],
          );
        }}
      >
        <Flex direction='column'>
          {Object.values(options).map(option => (
            <Checkbox key={option.value} my={1} value={option.value}>
              {option.title}
            </Checkbox>
          ))}
        </Flex>
      </CheckboxGroup>
    </Box>
  );
};
