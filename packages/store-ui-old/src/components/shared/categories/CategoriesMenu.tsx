import React, { useCallback } from 'react';
import { Treeview } from '@la-mk/blocks-ui';
import {
  getCategories,
  GroupedCategories,
  createGetGroupedCategories,
} from '../../../state/modules/categories/categories.selector';
import { useSelector } from 'react-redux';
import { useTranslation } from '../../../common/i18n';
import { Category } from '@la-mk/la-sdk/dist/models/category';

export interface CategoriesMenuProps {
  selectedKeys?: string[];
  onSelect?: (selected: string[]) => void;
}

export const CategoriesMenu = ({
  selectedKeys,
  onSelect,
}: CategoriesMenuProps) => {
  const categories: Category[] = useSelector(getCategories);
  const { t } = useTranslation();

  const getGroupedCategories = useCallback(() => {
    return createGetGroupedCategories((categoryKey: string) =>
      t(`categories.${categoryKey}`),
    );
  }, [t])();

  const groupedCategories: GroupedCategories = useSelector(
    getGroupedCategories,
  );

  if (!categories) {
    return null;
  }

  // Pass `multiple` if we want to allow multiple category selection
  return (
    <Treeview
      items={groupedCategories}
      selected={selectedKeys}
      onSelect={onSelect}
    />
  );
};
