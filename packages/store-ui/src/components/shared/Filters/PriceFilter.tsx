import isNumber from 'lodash/isNumber';
import toNumber from 'lodash/toNumber';
import React, { useState, useEffect } from 'react';
import { InputNumber, Slider, Flex, Text, utils } from '@sradevski/blocks-ui';
import { FilterObject } from '@sradevski/blocks-ui/dist/hooks/useFilter';
import { isString } from 'util';

const parsePriceFilter = (
  filtering: FilterObject['filtering'],
  min: number,
  max: number,
) => {
  if (!filtering || !filtering.calculatedPrice) {
    return [min, max];
  }

  // If it is an exact value, set that to be both from and to
  if (
    isString(filtering.calculatedPrice) ||
    isNumber(filtering.calculatedPrice)
  ) {
    return [
      toNumber(filtering.calculatedPrice),
      toNumber(filtering.calculatedPrice),
    ];
  }

  const fromPrice = toNumber(
    filtering.calculatedPrice.$gt || filtering.calculatedPrice.$gte || min,
  );
  const toPrice = toNumber(
    filtering.calculatedPrice.$lt || filtering.calculatedPrice.$lte || max,
  );

  return [fromPrice, toPrice];
};

interface PriceFilter {
  filters: FilterObject;
  min: number;
  max: number;
  onChange: (filters: FilterObject) => void;
}

export const PriceFilter = ({ filters, min, max, onChange }: PriceFilter) => {
  const [from, to] = parsePriceFilter(filters.filtering, min, max);
  const [range, setRange] = useState<[number, number]>([from, to]);
  const [start, end] = range;

  useEffect(() => {
    setRange([from, to]);
  }, [from, to]);

  const handleChangeDone = () => {
    onChange({
      ...filters,
      filtering: {
        ...(filters.filtering || {}),
        ...utils.filter.rangeFilter('calculatedPrice', start, end, min, max),
      },
    });
  };

  return (
    <Flex flexDirection='column'>
      <Flex alignItems='center' justifyContent='center'>
        <InputNumber
          onChange={val => val <= end && setRange([val, end])}
          onBlur={handleChangeDone}
          value={start}
        />
        <Text mx={2}>~</Text>
        <InputNumber
          onChange={val => val >= start && setRange([start, val])}
          onBlur={handleChangeDone}
          max={max}
          value={end}
          formatter={value =>
            value === max.toString() ? `${value}+` : value.toString()
          }
          parser={value => value.replace('+', '')}
        />
      </Flex>
      <Slider
        onChange={setRange as any}
        onAfterChange={handleChangeDone}
        range
        min={min}
        max={max}
        value={range}
        mt={4}
      />
    </Flex>
  );
};
