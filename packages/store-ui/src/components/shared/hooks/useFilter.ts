import noop from 'lodash/noop';
import { useState, useCallback } from 'react';
import queryString from 'qs';
import Router, { useRouter } from 'next/router';

export const useFilter = () => {
  // If it is not a browser environment (in case of SSR), just skip it
  // This should work fine with hooks as it is run on the server only.
  if (!process.browser) {
    return [null, noop];
  }

  // TODO: Track patch changes (when user goes back for example)
  const router = useRouter();

  const parsed = queryString.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  const [filters, setFilters] = useState(parsed);

  const handleSetFilter = useCallback(newFilters => {
    if (newFilters) {
      const stringified = queryString.stringify(newFilters);
      const baseUri = location.pathname;
      const newUri = `${baseUri}?${stringified}`;
      Router.push(newUri, newUri, { shallow: true });
    }

    setFilters(newFilters);
  }, []);

  return [filters, handleSetFilter];
};
