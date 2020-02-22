import isNil from 'lodash/isNil';
import Router from 'next/router';
import { FilterRouter } from '@sradevski/blocks-ui/dist/hooks/useFilter';

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
