import React, { useState, useEffect } from 'react';
import { InputNumber, Slider, Flex, Text, Button } from '@lamk/blocks-ui';
import { useTranslation } from '../../../common/i18n';

interface PriceFilter {
  from: number;
  to: number;
  min: number;
  max: number;
  onChange: (from: number, to: number) => void;
}

export const PriceFilter = ({ from, to, min, max, onChange }: PriceFilter) => {
  const { t } = useTranslation();
  const [range, setRange] = useState<[number, number]>([from, to]);
  const [start, end] = range;

  useEffect(() => {
    setRange([from, to]);
  }, [from, to]);

  return (
    <Flex p={3} flexDirection='column'>
      <Flex alignItems='center' justifyContent='center'>
        <InputNumber
          onChange={val => val <= end && setRange([val, end])}
          value={start}
        />
        <Text mx={2}>~</Text>
        <InputNumber
          onChange={val => val >= start && setRange([start, val])}
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
        range
        min={min}
        max={max}
        value={range}
        mt={4}
      />

      <Button
        disabled={from === start && to === end}
        onClick={() => onChange(start, end)}
        width='80px'
        type='primary'
        ml={'auto'}
        mt={4}
      >
        {t('common.ok')}
      </Button>
    </Flex>
  );
};
