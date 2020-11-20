import isString from 'lodash/isNumber';
import isNumber from 'lodash/isNumber';
import toNumber from 'lodash/toNumber';
import React, { useState, useEffect } from 'react';
import { InputNumber, Flex, utils, Button, Label } from '@sradevski/blocks-ui';
import { FilterObject } from '@sradevski/blocks-ui/dist/hooks/useFilter';
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
    <Flex flexDirection='column' alignItems='flex-start'>
      <Button onClick={() => onRangeSelected([min, 100])} kind='minimal'>
        <Label color={start === min && end === 100 ? 'primary' : 'text.dark'}>
          {'< 100 ден'}
        </Label>
      </Button>
      <Button onClick={() => onRangeSelected([100, 1000])} kind='minimal'>
        <Label color={start === 100 && end === 1000 ? 'primary' : 'text.dark'}>
          100 ден - 1000 ден
        </Label>
      </Button>
      <Button onClick={() => onRangeSelected([1000, 5000])} kind='minimal'>
        <Label color={start === 1000 && end === 5000 ? 'primary' : 'text.dark'}>
          1000 ден - 5000 ден
        </Label>
      </Button>
      <Button onClick={() => onRangeSelected([5000, max])} kind='minimal'>
        <Label color={start === 5000 && end === max ? 'primary' : 'text.dark'}>
          {'> 5000 ден'}
        </Label>
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
    <CustomCard
      {...props}
      title={t('common.price')}
      headerAction={
        <Button
          p={0}
          kind='minimal'
          onClick={() => {
            setRange([min, max]);
            handleChangeDone(min, max);
          }}
          startEnhancer={() => (
            <Label size='small' color='contentInversePrimary'>
              <ReloadOutlined />
            </Label>
          )}
        >
          <Label size='small' color='contentInversePrimary'>
            {t('actions.reset')}
          </Label>
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
        <Label mx={2}>~</Label>
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
