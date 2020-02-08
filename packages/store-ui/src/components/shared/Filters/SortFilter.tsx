import isEmpty from 'lodash/isEmpty';
import React from 'react';
import { Flex, Select, Option } from '@sradevski/blocks-ui';
import { useTranslation } from '../../../common/i18n';
import { FilterObject } from '@sradevski/blocks-ui/dist/hooks/useFilter';

interface SortFilterProps {
  filters: FilterObject;
  onChange: (filters: FilterObject) => void;
}

type SortValues = 'recommended' | 'cheap' | 'expensive';

const getSortValue = (sort: FilterObject['sorting']): SortValues => {
  if (isEmpty(sort)) {
    return 'recommended';
  }

  if (sort.field === 'price' && sort.order === 'ascend') {
    return 'cheap';
  }

  if (sort.field === 'price' && sort.order === 'descend') {
    return 'expensive';
  }
};

const getSortFromValue = (value: SortValues): FilterObject['sorting'] => {
  if (value === 'recommended') {
    return undefined;
  }

  if (value === 'cheap') {
    return { field: 'price', order: 'ascend' };
  }

  if (value === 'expensive') {
    return { field: 'price', order: 'descend' };
  }
};

export const SortFilter = ({ filters, onChange }: SortFilterProps) => {
  const { t } = useTranslation();
  const sortValue = getSortValue(filters.sorting);

  return (
    <Flex p={3} flexDirection='column'>
      <Select
        value={sortValue}
        onChange={value =>
          onChange({
            ...filters,
            sorting: getSortFromValue(value as SortValues),
          })
        }
      >
        <Option key={'recommended'} value={'recommended'}>
          {t('filters.recommended')}
        </Option>
        <Option key={'cheap'} value={'cheap'}>
          {t('filters.cheapestFirst')}
        </Option>
        <Option key={'expensive'} value={'expensive'}>
          {t('filters.expensiveFirst')}
        </Option>
      </Select>
    </Flex>
  );
};
