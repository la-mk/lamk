import toInteger from 'lodash/toInteger';
import * as queryString from 'qs';
import { FilterObject, MinifiedFilterObject } from '../hooks/useFilter';

export const expandFilterObject = (obj: MinifiedFilterObject): FilterObject => {
  if (!obj) {
    return {};
  }

  return {
    pagination: obj.p,
    filtering: obj.f,
    sorting: obj.s,
  };
};

export const minifiyFilterObject = ({
  pagination,
  filtering,
  sorting,
}: FilterObject): MinifiedFilterObject => {
  return {
    p: pagination,
    f: filtering,
    s: sorting,
  };
};

const paginationAsQuery = (
  pagination: FilterObject['pagination'] | undefined,
) => {
  if (!pagination) {
    return {};
  }

  return {
    $limit: pagination.pageSize,
    $skip: (pagination.currentPage - 1) * pagination.pageSize,
  };
};

const sortingAsQuery = (sorting: FilterObject['sorting'] | undefined) => {
  if (!sorting) {
    return {};
  }

  return {
    $sort: {
      [sorting.field]: sorting.order === 'ascend' ? 1 : -1,
    },
  };
};

const filteringAsQuery = (filtering: FilterObject['filtering']) => {
  return filtering || {};
};

export const filtersAsQuery = (filters: FilterObject) => {
  return {
    query: {
      ...paginationAsQuery(filters.pagination),
      ...sortingAsQuery(filters.sorting),
      ...filteringAsQuery(filters.filtering),
    },
  };
};

const getQueryString = (path: string) => {
  if (path.includes('?')) {
    return path.slice(path.indexOf('?') + 1);
  }

  return '';
};

export const parseFiltersUrl = (url: string) => {
  const parsed = queryString.parse(getQueryString(url));
  const expanded = expandFilterObject(parsed);
  return {
    ...expanded,
    pagination: expanded.pagination
      ? {
          currentPage: toInteger(expanded.pagination.currentPage),
          pageSize: toInteger(expanded.pagination.pageSize),
        }
      : undefined,
  };
};
