import React, { useCallback } from 'react';
import { Treeview } from '@sradevski/blocks-ui';
import {
  getCategories,
  GroupedCategories,
  createGetGroupedCategories,
} from '../../../state/modules/categories/categories.selector';
import { useSelector } from 'react-redux';
import { useTranslation } from '../../../common/i18n';
import { Category } from '@sradevski/la-sdk/dist/models/category';
// import Link from 'next/link';
// import { getQueryForCategories } from '../../common/filterUtils';

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

  return (
    <Treeview
      items={groupedCategories}
      selected={selectedKeys}
      onSelect={onSelect}
    />
  );
};
