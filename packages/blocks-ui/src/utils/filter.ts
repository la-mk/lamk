import toInteger from 'lodash/toInteger';
import * as queryString from 'qs';
import { FilterObject, MinifiedFilterObject } from '../hooks/useFilter';

export const singleItemFilter = (
  fieldName: string,
  value: string | number | null | undefined,
  notEqual?: boolean
) => {
  if (notEqual) {
    return { [fieldName]: { $ne: value } };
  }

  return { [fieldName]: value };
};

export const multipleItemsFilter = (
  fieldName: string,
  items: Array<string | number> | null | undefined,
  notEqual?: boolean
) => {
  if (!items || !items.length) {
    return { [fieldName]: undefined };
  }

  if (items.length === 1) {
    return singleItemFilter(fieldName, items[0], notEqual);
  }

  if (notEqual) {
    return { [fieldName]: { $nin: items } };
  }

  return { [fieldName]: { $in: items } };
};

export const rangeFilter = (
  fieldName: string,
  from: number | null | undefined,
  to: number | null | undefined,
  minValue: number,
  maxValue: number
) => {
  let query: { $gte?: number; $lte?: number } = {};
  if (from === null || from === undefined || to === null || to === undefined) {
    return { [fieldName]: undefined };
  }

  if (from === to || from > to) {
    return { [fieldName]: from };
  }

  if (from > minValue) {
    query.$gte = from;
  }

  if (to < maxValue) {
    query.$lte = to;
  }

  return { [fieldName]: query };
};

export const expandFilterObject = (obj: MinifiedFilterObject): FilterObject => {
  if (!obj) {
    return {};
  }

  return {
    pagination: obj.p,
    filtering: obj.f,
    sorting: obj.s,
    searching: obj.q,
  };
};

export const minifiyFilterObject = ({
  pagination,
  filtering,
  sorting,
  searching,
}: FilterObject): MinifiedFilterObject => {
  return {
    p: pagination,
    f: filtering,
    s: sorting,
    q: searching,
  };
};

const paginationAsQuery = (
  pagination: FilterObject['pagination'] | undefined
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

const searchingAsQuery = (searching: FilterObject['searching']) => {
  if(!searching){
    return {}
  }

  return {
    search: searching,
  }
}

export const filtersAsQuery = (filters: FilterObject) => {
  return {
    query: {
      ...paginationAsQuery(filters.pagination),
      ...sortingAsQuery(filters.sorting),
      ...filteringAsQuery(filters.filtering),
      ...searchingAsQuery(filters.searching),
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

export const stringifyFilters = (filters: MinifiedFilterObject) => {
  return queryString.stringify(filters);
}
