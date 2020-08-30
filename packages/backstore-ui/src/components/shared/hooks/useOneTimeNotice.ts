import React from 'react';

export const useOneTimeNotice = (slug: string): [boolean, () => void] => {
  const hideNotice = React.useCallback(() => {
    if (!slug) {
      return;
    }

    setShouldHide(true);
    localStorage.setItem(
      slug,
      JSON.stringify({ data: true, timestamp: Date.now() }),
    );
  }, [slug]);

  const [shouldHide, setShouldHide] = React.useState(
    JSON.parse(localStorage.getItem(slug) ?? '{}')?.data,
  );

  React.useEffect(() => {
    if (!slug) {
      return;
    }

    setShouldHide(
      JSON.parse(localStorage.getItem(slug) ?? '{}')?.data ?? false,
    );
  }, [slug]);

  return [shouldHide, hideNotice];
};
