import React from 'react';
import { ErrorBoundary as BaseErrorBoundary } from 'react-error-boundary';
import { Result } from '@sradevski/blocks-ui';
import { useTranslation } from 'react-i18next';

export const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();

  return (
    <BaseErrorBoundary
      FallbackComponent={() => (
        <Result
          status='error'
          title={t('results.genericError')}
          subTitle={t('results.serverErrorExplanation')}
        />
      )}
    >
      {children}
    </BaseErrorBoundary>
  );
};
