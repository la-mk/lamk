import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  createGetGroupedCategories,
  getCategories,
  GroupedCategories,
} from '../../../state/modules/categories/categories.selector';
import { Category } from '@la-mk/la-sdk/dist/models/category';
import { TFunction } from 'i18next';

export const useCategories = (
  t: TFunction,
): [Category[] | null, GroupedCategories | null] => {
  const getGroupedCategories = useCallback(() => {
    return createGetGroupedCategories((categoryKey: string) =>
      t(`categories.${categoryKey}`),
    );
  }, [t])();

  const groupedCategories: GroupedCategories | null = useSelector(
    getGroupedCategories,
  );
  const categories: Category[] | null = useSelector(getCategories);

  return [categories, groupedCategories];
};
