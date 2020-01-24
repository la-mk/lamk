import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioButton, Flex, Button } from '@sradevski/blocks-ui';
import { useTranslation } from '../../../common/i18n';
import { FilterObject } from '@sradevski/blocks-ui/dist/hooks/useFilter';

interface SortFilterProps {
  sort: FilterObject['sorting'];
  onCancel: () => void;
  onChange: (sort: FilterObject['sorting']) => void;
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

export const SortFilter = ({ sort, onCancel, onChange }: SortFilterProps) => {
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

      <Flex mt={4} justifyContent='flex-end'>
        <Button onClick={onCancel} width='100px' mr={3}>
          {t('actions.cancel')}
        </Button>
        <Button
          disabled={isEqual(getSortValue(sort), localSort)}
          onClick={() => onChange(getSortFromValue(localSort))}
          width='100px'
          type='primary'
        >
          {t('common.ok')}
        </Button>
      </Flex>
    </Flex>
  );
};
