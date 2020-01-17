import React, { useState, useEffect } from 'react';
import { InputNumber, Slider, Flex, Text, Button } from '@sradevski/blocks-ui';
import { useTranslation } from '../../../common/i18n';

interface PriceFilter {
  from: number;
  to: number;
  min: number;
  max: number;
  onCancel: () => void;
  onChange: (from: number, to: number) => void;
}

export const PriceFilter = ({
  from,
  to,
  min,
  max,
  onCancel,
  onChange,
}: PriceFilter) => {
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

      <Flex mt={4} justifyContent='flex-end'>
        <Button onClick={onCancel} width='100px' mr={3}>
          {t('actions.cancel')}
        </Button>
        <Button
          disabled={from === start && to === end}
          onClick={() => onChange(start, end)}
          width='100px'
          type='primary'
        >
          {t('common.ok')}
        </Button>
      </Flex>
    </Flex>
  );
};
