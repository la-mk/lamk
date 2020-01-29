import merge from 'lodash/merge';
import noop from 'lodash/noop';
import { useState, useCallback, useMemo } from 'react';
import {
  expandFilterObject,
  minifiyFilterObject,
  parseFiltersUrl,
  stringifyFilters,
} from '../utils/filter';

export interface FilterRouter {
  push: (
    uri: string,
    as: string,
    options: {
      shallow: boolean;
    },
  ) => void;
}

export interface UseFilterConfig {
  storage: 'url' | 'local' | 'session';
  storageKey?: string | number;
  router?: FilterRouter;
}

export interface FilterObject {
  pagination?: { currentPage: number; pageSize: number };
  filtering?: any;
  sorting?: { field: string; order: 'ascend' | 'descend' };
}

export interface MinifiedFilterObject {
  p?: FilterObject['pagination'];
  f?: FilterObject['filtering'];
  s?: FilterObject['sorting'];
}

const defaultConfig: UseFilterConfig = {
  storage: 'session',
};

const getInitialState = (
  storage: UseFilterConfig['storage'],
  storageKey?: UseFilterConfig['storageKey'],
) => {
  switch (storage) {
    case 'url': {
      return parseFiltersUrl(location.href);
    }

    case 'local': {
      if (!localStorage) {
        return {} as FilterObject;
      }
      const key = storageKey || location.pathname;
      const asObj = localStorage[key] ? JSON.parse(localStorage[key]) : {};
      return expandFilterObject(asObj as MinifiedFilterObject);
    }

    case 'session': {
      if (!sessionStorage) {
        return {} as FilterObject;
      }

      const key = storageKey || location.pathname;
      const asObj = sessionStorage[key] ? JSON.parse(sessionStorage[key]) : {};
      return expandFilterObject(asObj as MinifiedFilterObject);
    }
  }
};

const addToStorage = (
  filter: MinifiedFilterObject,
  storage: UseFilterConfig['storage'],
  storageKey?: UseFilterConfig['storageKey'],
  router?: FilterRouter,
) => {
  switch (storage) {
    case 'url': {
      const stringified = stringifyFilters(filter)
      const baseUri = location.pathname;
      const newUri = `${baseUri}?${stringified}`;
      if (!router) {
        throw new Error('You need to provide a router for URL storage');
      }

      router.push(newUri, newUri, { shallow: true });
      return;
    }

    case 'local': {
      if (!localStorage) {
        return;
      }
      const key = storageKey || location.pathname;
      localStorage[key] = JSON.stringify(filter);
      return;
    }

    case 'session': {
      if (!sessionStorage) {
        return;
      }

      const key = storageKey || location.pathname;
      sessionStorage[key] = JSON.stringify(filter);
      return;
    }
  }
};

// FUTURE: Add listener to all of the stores
export const useFilter = (
  initialFilters: FilterObject | null,
  config?: UseFilterConfig,
): [FilterObject, (filter: FilterObject) => void] => {
  // If it is not a browser environment (in case of SSR with NextJS), just skip it
  // This should work fine with hooks being defined conditionally as it is run on the server only.
  // @ts-ignore
  if (!process.browser) {
    return [initialFilters || {}, noop];
  }

  let mergedConfig: any = {}
  merge(mergedConfig, defaultConfig, config);
  const { storage, storageKey, router } = mergedConfig;

  const initialState = useMemo(
    () => (initialFilters ? initialFilters : getInitialState(storage)),
    [],
  );

  const [filters, setFilters] = useState(initialState);

  // TODO: Handle situations when due to filtering the total number of objects is less than the pagination. Maybe reset pagination on every filter change?
  const handleSetFilter = useCallback((filters: FilterObject) => {
    const minified = minifiyFilterObject(filters);
    addToStorage(minified, storage, storageKey, router);
    setFilters(filters);
  }, []);

  return [filters, handleSetFilter];
};
