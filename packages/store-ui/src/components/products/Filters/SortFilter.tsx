import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioButton, Flex, Button } from '@lamk/blocks-ui';
import { useTranslation } from '../../../common/i18n';

interface SortFilterProps {
  sort: { [key: string]: number };
  onChange: (sort: any) => void;
}

type SortValues = 'recommended' | 'cheap' | 'expensive';

const getSortValue = (sort: SortFilterProps['sort']): SortValues => {
  if (isEmpty(sort)) {
    return 'recommended';
  }

  if (sort.price && sort.price === 1) {
    return 'cheap';
  }

  if (sort.price && sort.price === -1) {
    return 'expensive';
  }
};

const getSortFromValue = (value: SortValues) => {
  if (value === 'recommended') {
    return {};
  }

  if (value === 'cheap') {
    return { price: 1 };
  }

  if (value === 'expensive') {
    return { price: -1 };
  }
};

export const SortFilter = ({ sort, onChange }: SortFilterProps) => {
  const { t } = useTranslation();
  const [localSort, setLocalSort] = useState(getSortValue(sort));

  useEffect(() => {
    setLocalSort(getSortValue(sort));
  }, [sort]);

  return (
    <Flex p={3} flexDirection='column'>
      <RadioGroup
        value={localSort}
        onChange={e => setLocalSort(e.target.value)}
      >
        <RadioButton value={'recommended'}>
          {t('filters.recommended')}
        </RadioButton>
        <RadioButton value={'cheap'}>{t('filters.cheapestFirst')}</RadioButton>
        <RadioButton value={'expensive'}>
          {t('filters.expensiveFirst')}
        </RadioButton>
      </RadioGroup>

      <Button
        disabled={isEqual(getSortValue(sort), localSort)}
        onClick={() => onChange(getSortFromValue(localSort))}
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
