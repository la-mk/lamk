import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import Router from 'next/router';
import queryString from 'qs';
import { FilterRouter } from '@sradevski/blocks-ui/dist/hooks/useFilter';
import { ProductSet } from '@sradevski/la-sdk/dist/models/product';
import { Category } from '@sradevski/la-sdk/dist/models/category';

export const getFiltersFromSetQuery = (query: { [key: string]: any }) => {
  if (query.$sort) {
    const [field, order] = Object.entries(query.$sort)[0];
    return { s: { field, order: order === 1 ? 'ascend' : 'descend' } };
  }

  return { f: query };
};

export const getFiltersFromSearch = (search: string) => {
  if (isNil(search)) {
    return {};
  }

  return { q: search };
};

export const filterRouter = {
  push: Router.push,
  routeChangeListener: cb => {
    Router.events.on('routeChangeComplete', cb);
    return () => Router.events.off('routeChangeComplete', cb);
  },
} as FilterRouter;

export const getSetHref = (set: ProductSet) =>
  `/products?${queryString.stringify(
    getFiltersFromSetQuery(set.filter.query),
  )}`;

export const getQueryForCategories = (categories: string | string[]) => {
  if (isString(categories)) {
    return queryString.stringify({ f: { category: categories } });
  }

  return queryString.stringify({ f: { category: { $in: categories } } });
};

export const getLevel2CategoryHref = (
  categoryName: string,
  categories: Category[],
) => {
  const level3Categories = categories
    .filter(category => category.level2 === categoryName)
    .map(category => category.level3);

  return `/products?${getQueryForCategories(level3Categories)}`;
};
