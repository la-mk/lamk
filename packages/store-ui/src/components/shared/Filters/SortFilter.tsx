import isEmpty from 'lodash/isEmpty';
import React from 'react';
import { hooks, Radio } from '@sradevski/blocks-ui';
import { useTranslation } from '../../../common/i18n';
import { FilterObject } from '@sradevski/blocks-ui/dist/hooks/useFilter';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

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

  if (sort.field === 'minCalculatedPrice' && sort.order === 'ascend') {
    return 'cheap';
  }

  if (sort.field === 'minCalculatedPrice' && sort.order === 'descend') {
    return 'expensive';
  }
};

const getSortFromValue = (value: SortValues): FilterObject['sorting'] => {
  if (value === 'recommended') {
    return undefined;
  }

  if (value === 'cheap') {
    return { field: 'minCalculatedPrice', order: 'ascend' };
  }

  if (value === 'expensive') {
    return { field: 'minCalculatedPrice', order: 'descend' };
  }
};

export const SortFilter = ({ filters, onChange }: SortFilterProps) => {
  const isMobile = hooks.useBreakpoint([true, false, false]);
  const { t } = useTranslation();
  const sortValue = getSortValue(filters.sorting);

  return (
    <>
      <Radio
        value={sortValue}
        onChange={newVal => {
          onChange({
            ...filters,
            sorting: getSortFromValue(newVal as SortValues),
          });
        }}
        options={[
          {
            value: 'recommended',
            children: t('filters.recommended'),
          },
          {
            value: 'cheap',
            children: isMobile ? (
              <>
                <DownOutlined style={{ marginRight: 8 }} />
                {t('common.price')}
              </>
            ) : (
              t('filters.cheapestFirst')
            ),
          },
          {
            value: 'expensive',
            children: isMobile ? (
              <>
                <UpOutlined style={{ marginRight: 8 }} />
                {t('common.price')}
              </>
            ) : (
              t('filters.expensiveFirst')
            ),
          },
        ]}
        variant='button'
        ml='auto'
      />
    </>
  );
};
