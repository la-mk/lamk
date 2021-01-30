import { LocalizationContext } from '../Provider';
import React, { useContext } from 'react';
import { ErrorBoundary as BaseErrorBoundary } from 'react-error-boundary';
import { Result } from '../Result';

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export const ErrorBoundary = ({ children }: ErrorBoundaryProps) => {
  const localization = useContext(LocalizationContext);

  return (
    <BaseErrorBoundary
      FallbackComponent={() => (
        <Result
          mt={4}
          status="error"
          title={localization.genericError ?? 'An error occured'}
          description={
            localization.genericErrorExplanation ??
            'If the issue persists, please get in touch with us'
          }
        />
      )}
    >
      {children}
    </BaseErrorBoundary>
  );
};
