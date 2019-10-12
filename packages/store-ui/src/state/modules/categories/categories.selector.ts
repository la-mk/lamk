import groupBy from 'lodash/groupBy';
import { createSelector } from 'reselect';
import { CascaderOptionType } from 'antd/es/cascader';

const NUM_LEVELS = 3;

export type GroupedCategories = CascaderOptionType[];

export const getCategories = createSelector<any, any, any>(
  state => state.categories,
  categories => categories.categories,
);

const getFormattedLevel = (group: any, level: number) => {
  return Object.keys(group).reduce((res: any, groupKey) => {
    const children =
      level < NUM_LEVELS
        ? getFormattedLevel(
            groupBy(group[groupKey], `level${level + 1}`),
            level + 1,
          )
        : undefined;

    res.push({
      label: groupKey,
      value: groupKey,
      children,
    });

    return res;
  }, []);
};

export const getGroupedCategories = createSelector<any, any, any>(
  state => state.categories,
  categories => {
    if (!categories.categories) {
      return null;
    }

    const level1Grouped = groupBy(categories.categories, 'level1');
    return getFormattedLevel(level1Grouped, 1) as GroupedCategories;
  },
);
