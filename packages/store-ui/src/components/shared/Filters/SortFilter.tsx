import isEmpty from 'lodash/isEmpty';
import React from 'react';
import { RadioGroup, RadioButton } from '@sradevski/blocks-ui';
import { useTranslation } from '../../../common/i18n';
import { FilterObject } from '@sradevski/blocks-ui/dist/hooks/useFilter';

interface SortFilterProps {
  filters: FilterObject;
  onChange: (filters: FilterObject) => void;
}

type SortValues = 'recommended' | 'cheap' | 'expensive';

const getSortValue = (sort: FilterObject['sorting']): SortValues => {
  // Currently we don't have a ranking system, so we just use createdAt as te one.
  if (isEmpty(sort) || sort.field === 'createdAt') {
    return 'recommended';
  }

  if (sort.field === 'calculatedPrice' && sort.order === 'ascend') {
    return 'cheap';
  }

  if (sort.field === 'calculatedPrice' && sort.order === 'descend') {
    return 'expensive';
  }
};

const getSortFromValue = (value: SortValues): FilterObject['sorting'] => {
  if (value === 'recommended') {
    return undefined;
  }

  if (value === 'cheap') {
    return { field: 'calculatedPrice', order: 'ascend' };
  }

  if (value === 'expensive') {
    return { field: 'calculatedPrice', order: 'descend' };
  }
};

export const SortFilter = ({ filters, onChange }: SortFilterProps) => {
  const { t } = useTranslation();
  const sortValue = getSortValue(filters.sorting);

  return (
    <>
      <RadioGroup
        value={sortValue}
        onChange={value =>
          onChange({
            ...filters,
            sorting: getSortFromValue(value.target.value as SortValues),
          })
        }
      >
        <RadioButton key={'recommended'} value={'recommended'}>
          {t('filters.recommended')}
        </RadioButton>
        <RadioButton key={'cheap'} value={'cheap'}>
          {t('filters.cheapestFirst')}
        </RadioButton>
        <RadioButton key={'expensive'} value={'expensive'}>
          {t('filters.expensiveFirst')}
        </RadioButton>
      </RadioGroup>
    </>
  );
};
