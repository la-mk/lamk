import uniq from 'lodash/uniq';
import groupBy from 'lodash/groupBy';
import { createSelector } from 'reselect';
import { CascaderOptionType } from 'antd/es/cascader';
import { Category } from '@sradevski/la-sdk/dist/models/category';

const NUM_LEVELS = 3;

export type GroupedCategories = CascaderOptionType[];

export const getCategories = createSelector<any, any, any>(
  state => state.categories,
  categories => categories.categories,
);

export const getUniqueCategories = (level: 'level1' | 'level2' | 'level3') => {
  return createSelector<any, any, any>(
    state => state.categories,
    categories =>
      categories.categories
        ? uniq(categories.categories.map((x: Category) => x[level]))
        : [],
  );
};

const getFormattedLevel = (
  group: any,
  level: number,
  getLabel: (categoryKey: string) => string,
) => {
  return Object.keys(group).reduce((res: any, groupKey) => {
    const children =
      level < NUM_LEVELS
        ? getFormattedLevel(
            groupBy(group[groupKey], `level${level + 1}`),
            level + 1,
            getLabel,
          )
        : undefined;

    res.push({
      label: getLabel(groupKey),
      value: groupKey,
      children,
    });

    return res;
  }, []);
};

export const createGetGroupedCategories = (
  getLabel: (categoryKey: string) => string,
) =>
  createSelector<any, any, any>(
    state => state.categories,
    categories => {
      if (!categories.categories) {
        return null;
      }

      const level1Grouped = groupBy(categories.categories, 'level1');
      return getFormattedLevel(level1Grouped, 1, getLabel) as GroupedCategories;
    },
  );
