import { groupBy } from 'lodash';

export interface Category {
  level1: string;
  level2: string;
  level3: string;
}

export interface TreeviewEntry {
  title: string;
  key: string;
  children?: TreeviewEntry[];
}

const NUM_LEVELS = 3;

export const getGroupedCategories = (
  categories: Category[],
  getCategoryLabel: (categorySlug: string) => string,
) => {
  const level1Grouped = groupBy(categories, 'level1');
  return getFormattedLevel(level1Grouped, 1, getCategoryLabel);
};

const getFormattedLevel = (
  group: any,
  level: number,
  getLabel: (categoryKey: string) => string,
): Array<TreeviewEntry> => {
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
      title: getLabel(groupKey),
      key: groupKey,
      children,
    });

    return res;
  }, []);
};
