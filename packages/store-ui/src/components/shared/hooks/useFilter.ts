import noop from 'lodash/noop';
import { useState, useCallback } from 'react';
import queryString from 'qs';

export const useFilter = () => {
  // If it is not a browser environment (in case of SSR), just skip it
  if (!process.browser) {
    return [null, noop];
  }

  const parsed = queryString.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  const [filters, setFilters] = useState(parsed);

  const handleSetFilter = useCallback(newFilters => {
    if (newFilters) {
      const stringified = queryString.stringify(newFilters);
      location.search = stringified;
    }

    setFilters(newFilters);
  }, []);

  return [filters, handleSetFilter];
};
