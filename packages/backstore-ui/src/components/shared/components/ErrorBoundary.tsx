import React from 'react';
import { ErrorBoundary as BaseErrorBoundary } from 'react-error-boundary';
import { Result } from '@la-mk/blocks-ui';
import { useTranslation } from 'react-i18next';

export const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();

  return (
    <BaseErrorBoundary
      FallbackComponent={() => (
        <Result
          mt={4}
          status='error'
          title={t('results.genericError')}
          description={t('results.serverErrorExplanation')}
        />
      )}
    >
      {children}
    </BaseErrorBoundary>
  );
};
