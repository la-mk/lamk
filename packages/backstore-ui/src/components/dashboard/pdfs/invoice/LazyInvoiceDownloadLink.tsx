import { Spinner } from '@la-mk/blocks-ui';
import React, { Suspense } from 'react';
import { InvoiceProps } from './Invoice';

const InvoiceDownloadLink = React.lazy(() => import('./InvoiceDownloadLink'));

export const LazyInvoiceDownloadLink = (
  props: InvoiceProps & { children: React.ReactNode },
) => {
  return (
    <Suspense fallback={<Spinner isLoaded={false} size='xs' />}>
      <InvoiceDownloadLink {...props} />
    </Suspense>
  );
};
