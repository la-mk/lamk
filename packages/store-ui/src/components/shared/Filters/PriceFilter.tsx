import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import toNumber from 'lodash/toNumber';
import React, { useState, useEffect } from 'react';
import { Input, Flex, Text, utils, Button } from '@la-mk/blocks-ui';
import { FilterObject } from '@la-mk/blocks-ui/dist/hooks/useFilter';
import { useTranslation } from '../../../common/i18n';
import { CustomCard } from '../components/CustomCard';
import { ReloadOutlined } from '@ant-design/icons';

const parsePriceFilter = (
  filtering: FilterObject['filtering'],
  min: number,
  max: number,
) => {
  if (!filtering || !filtering.minCalculatedPrice) {
    return [min, max];
  }

  // If it is an exact value, set that to be both from and to
  if (
    isString(filtering.minCalculatedPrice) ||
    isNumber(filtering.minCalculatedPrice)
  ) {
    return [
      toNumber(filtering.minCalculatedPrice),
      toNumber(filtering.minCalculatedPrice),
    ];
  }

  const fromPrice = toNumber(
    filtering.minCalculatedPrice.$gt ||
      filtering.minCalculatedPrice.$gte ||
      min,
  );
  const toPrice = toNumber(
    filtering.minCalculatedPrice.$lt ||
      filtering.minCalculatedPrice.$lte ||
      max,
  );

  return [fromPrice, toPrice];
};

interface PriceFilter {
  filters: FilterObject;
  min: number;
  max: number;
  onChange: (filters: FilterObject) => void;
}

const PredefinedRanges = ({ min, max, start, end, onRangeSelected }) => {
  return (
    <Flex direction='column' align='flex-start'>
      <Button onClick={() => onRangeSelected([min, 100])} variant='ghost'>
        <Text color={start === min && end === 100 ? 'primary' : 'text.dark'}>
          {'< 100 ден'}
        </Text>
      </Button>
      <Button onClick={() => onRangeSelected([100, 1000])} variant='ghost'>
        <Text color={start === 100 && end === 1000 ? 'primary' : 'text.dark'}>
          100 ден - 1000 ден
        </Text>
      </Button>
      <Button onClick={() => onRangeSelected([1000, 5000])} variant='ghost'>
        <Text color={start === 1000 && end === 5000 ? 'primary' : 'text.dark'}>
          1000 ден - 5000 ден
        </Text>
      </Button>
      <Button onClick={() => onRangeSelected([5000, max])} variant='ghost'>
        <Text color={start === 5000 && end === max ? 'primary' : 'text.dark'}>
          {'> 5000 ден'}
        </Text>
      </Button>
    </Flex>
  );
};

export const PriceFilter = ({
  filters,
  min,
  max,
  onChange,
  ...props
}: PriceFilter & React.ComponentProps<typeof CustomCard>) => {
  const { t } = useTranslation();
  const [from, to] = parsePriceFilter(filters.filtering, min, max);
  const [range, setRange] = useState<[number, number]>([from, to]);
  const [start, end] = range;

  useEffect(() => {
    setRange([from, to]);
  }, [from, to]);

  const handleChangeDone = (f, t) => {
    onChange({
      ...filters,
      filtering: {
        ...(filters.filtering || {}),
        ...utils.filter.rangeFilter('minCalculatedPrice', f, t, min, max),
      },
    });
  };

  return (
    <CustomCard {...props}>
      <Flex px={3} justify='space-between' mb={4}>
        <Text>{t('common.price')}</Text>
        <Button
          variant='link'
          onClick={() => {
            setRange([min, max]);
            handleChangeDone(min, max);
          }}
          leftIcon={<ReloadOutlined />}
          size='sm'
        >
          {t('actions.reset')}
        </Button>
      </Flex>
      <PredefinedRanges
        min={min}
        max={max}
        start={start}
        end={end}
        onRangeSelected={range => {
          setRange(range);
          handleChangeDone(range[0], range[1]);
        }}
      />

      <Flex mt={3} align='center'>
        <Input
          type='number'
          onChange={(_e, val: number) => val <= end && setRange([val, end])}
          onBlur={() => handleChangeDone(start, end)}
          value={start}
        />
        <Text mx={2}>~</Text>
        <Input
          type='number'
          onChange={(_e, val: number) => val >= start && setRange([start, val])}
          onBlur={() => handleChangeDone(start, end)}
          max={max}
          value={max === end ? `${end}+` : end}
        />
      </Flex>
    </CustomCard>
  );
};
