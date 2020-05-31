import isNumber from 'lodash/isNumber';
import toNumber from 'lodash/toNumber';
import React, { useState, useEffect } from 'react';
import { InputNumber, Flex, Text, utils, Button } from '@sradevski/blocks-ui';
import { FilterObject } from '@sradevski/blocks-ui/dist/hooks/useFilter';
import { isString } from 'util';
import { useTranslation } from '../../../common/i18n';
import { CustomCard } from '../components/CustomCard';
import { ReloadOutlined } from '@ant-design/icons';

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

const PredefinedRanges = ({ min, max, start, end, onRangeSelected }) => {
  return (
    <Flex flexDirection='column' alignItems='flex-start'>
      <Button onClick={() => onRangeSelected([min, 100])} type='link'>
        <Text color={start === min && end === 100 ? 'primary' : 'text.dark'}>
          {'< 100 ден'}
        </Text>
      </Button>
      <Button onClick={() => onRangeSelected([100, 1000])} type='link'>
        <Text color={start === 100 && end === 1000 ? 'primary' : 'text.dark'}>
          100 ден - 1000 ден
        </Text>
      </Button>
      <Button onClick={() => onRangeSelected([1000, 5000])} type='link'>
        <Text color={start === 1000 && end === 5000 ? 'primary' : 'text.dark'}>
          1000 ден - 5000 ден
        </Text>
      </Button>
      <Button onClick={() => onRangeSelected([5000, max])} type='link'>
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
        ...utils.filter.rangeFilter('calculatedPrice', f, t, min, max),
      },
    });
  };

  return (
    <CustomCard
      {...props}
      title={t('common.price')}
      headerAction={
        <Button
          p={0}
          type='link'
          onClick={() => {
            setRange([min, max]);
            handleChangeDone(min, max);
          }}
        >
          <Text fontSize={0} color='mutedText.light'>
            <ReloadOutlined style={{ marginRight: 8 }} />
            {t('actions.reset')}
          </Text>
        </Button>
      }
    >
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

      <Flex mt={2} alignItems='center'>
        <InputNumber
          onChange={(val: number) => val <= end && setRange([val, end])}
          onBlur={() => handleChangeDone(start, end)}
          value={start}
        />
        <Text mx={2}>~</Text>
        <InputNumber
          onChange={(val: number) => val >= start && setRange([start, val])}
          onBlur={() => handleChangeDone(start, end)}
          max={max}
          value={end}
          formatter={value =>
            value === max.toString() ? `${value}+` : value.toString()
          }
          parser={value => value.replace('+', '')}
        />
      </Flex>
    </CustomCard>
  );
};
