import isString from 'lodash/isString';
import React from 'react';
import { FilterObject } from '@sradevski/blocks-ui/dist/hooks/useFilter';
import { CategoriesMenu, CategoriesMenuProps } from '../CategoriesMenu';
import { utils } from '@sradevski/blocks-ui';
import { FiltersTitle } from './FiltersTitle';
import { useTranslation } from '../../../common/i18n';

const parseCategoryFilter = (filtering: FilterObject['filtering']) => {
  if (!filtering || !filtering.category) {
    return [];
  }

  if (isString(filtering.category)) {
    return [filtering.category];
  }

  return filtering.category.$in || [];
};

interface CategoriesFilterProps {
  filters: FilterObject;
  onChange: (filters: FilterObject) => void;
  mode: CategoriesMenuProps['mode'];
}

export const CategoriesFilter = ({
  filters,
  onChange,
  mode,
}: CategoriesFilterProps) => {
  const { t } = useTranslation();
  const selectedCategories = parseCategoryFilter(filters.filtering);

  const handleSelectedCategoriesChange = ({
    selectedKeys,
  }: {
    selectedKeys: string[];
  }) => {
    onChange({
      ...filters,
      filtering: {
        ...filters.filtering,
        ...utils.filter.multipleItemsFilter('category', selectedKeys),
      },
    });
  };

  return (
    <>
      <FiltersTitle
        title={t('common.category_plural')}
        onReset={() => handleSelectedCategoriesChange({ selectedKeys: [] })}
      />
      <CategoriesMenu
        mode={mode}
        selectedKeys={selectedCategories}
        onSelect={handleSelectedCategoriesChange}
      />
    </>
  );
};
