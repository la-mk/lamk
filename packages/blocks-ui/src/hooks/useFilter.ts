/* eslint-disable react-hooks/rules-of-hooks */
import merge from 'lodash/merge';
import noop from 'lodash/noop';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import { useState, useCallback, useMemo, useEffect } from 'react';
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
    }
  ) => void;
  routeChangeListener?: (cb: () => void) => () => void;
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
  searching?: string;
}

export interface MinifiedFilterObject {
  p?: FilterObject['pagination'];
  f?: FilterObject['filtering'];
  s?: FilterObject['sorting'];
  q?: FilterObject['searching'];
}

const defaultConfig: UseFilterConfig = {
  storage: 'session',
};

const getStorageState = (
  storage?: UseFilterConfig['storage'],
  storageKey?: UseFilterConfig['storageKey']
) => {
  switch (storage) {
    case 'url': {
      // TODO: Some of the parsed values can be a number, but this will return all of them as strings.
      return parseFiltersUrl(window.location.href);
    }

    case 'local': {
      if (!localStorage) {
        return {} as FilterObject;
      }
      const key = storageKey || window.location.pathname;
      const asObj = localStorage[key] ? JSON.parse(localStorage[key]) : {};
      return expandFilterObject(asObj as MinifiedFilterObject);
    }

    case 'session': {
      if (!sessionStorage) {
        return {} as FilterObject;
      }

      const key = storageKey || window.location.pathname;
      const asObj = sessionStorage[key] ? JSON.parse(sessionStorage[key]) : {};
      return expandFilterObject(asObj as MinifiedFilterObject);
    }

    default:
      return {};
  }
};

const addToStorage = (
  filter: MinifiedFilterObject,
  storage?: UseFilterConfig['storage'],
  storageKey?: UseFilterConfig['storageKey'],
  router?: FilterRouter
) => {
  switch (storage) {
    case 'url': {
      const stringified = stringifyFilters(filter);
      const baseUri = window.location.pathname;
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
      const key = storageKey || window.location.pathname;
      localStorage[key] = JSON.stringify(filter);
      return;
    }

    case 'session': {
      if (!sessionStorage) {
        return;
      }

      const key = storageKey || window.location.pathname;
      sessionStorage[key] = JSON.stringify(filter);
      return;
    }
  }
};

// If the filtering changes, the number of shown items potentially changes as well, so we want to reset pagination in order for it to not be larger than the total items shown
const resetPaginationIfNecessary = (
  filtersBefore: FilterObject,
  filtersAfter: FilterObject
) => {
  // This takes care of null, undefined, and an empty object, which are practically the same;
  const isFilteringEquallyEmpty =
    isEmpty(filtersBefore.filtering) === true &&
    isEmpty(filtersAfter.filtering) === true;
  const isSearchEquallyEmpty =
    isEmpty(filtersBefore.searching) === true &&
    isEmpty(filtersAfter.searching) === true;

  const isFilteringSame =
    isFilteringEquallyEmpty ||
    isEqual(filtersBefore.filtering, filtersAfter.filtering);
  const isSearchingSame =
    isSearchEquallyEmpty ||
    isEqual(filtersBefore.searching, filtersAfter.searching);

  if (isFilteringSame && isSearchingSame) {
    return filtersAfter;
  }

  return {
    ...filtersAfter,
    pagination: {
      pageSize: filtersAfter.pagination?.pageSize || 20,
      currentPage: 1,
    },
  };
};

// FUTURE: Add listener to all of the stores
export const useFilter = (
  initialFilters: FilterObject | null,
  config?: UseFilterConfig
): [FilterObject, (filter: FilterObject) => void] => {
  // If it is not a browser environment (in case of SSR with NextJS), just skip it
  // This should work fine with hooks being defined conditionally as it is run on the server only.
  // @ts-ignore
  if (!process.browser) {
    return [initialFilters || {}, noop];
  }

  let mergedConfig: Partial<UseFilterConfig> = {};
  merge(mergedConfig, defaultConfig, config);
  const { storage, storageKey, router } = mergedConfig;

  const initialState = useMemo(
    () =>
      initialFilters ? initialFilters : getStorageState(storage, storageKey),
    []
  );

  const [filters, setFilters] = useState(initialState);

  // Listen to storage state changes and make it the source of truth.
  useEffect(() => {
    if (storage === 'url' && router?.routeChangeListener) {
      const listener = () => {
        const storageState = getStorageState(storage, storageKey);
        if (!isEqual(filters, storageState)) {
          const normalized = resetPaginationIfNecessary(filters, storageState);
          setFilters(normalized);
        }
      };

      return router.routeChangeListener(listener);
    }
    // FUTURE: Add listener for local and session storage as well.

    return;
  }, [filters, storage, storageKey]);

  const handleSetFilter = useCallback(
    (updatedFilters: FilterObject) => {
      const normalized = resetPaginationIfNecessary(filters, updatedFilters);
      const minified = minifiyFilterObject(normalized);
      addToStorage(minified, storage, storageKey, router);
      setFilters(normalized);
    },
    [filters]
  );

  return [filters, handleSetFilter];
};
