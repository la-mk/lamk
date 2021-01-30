import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { ErrorBoundary } from './';
import { Provider } from '../../';

const ThrowComponent = () => {
  React.useEffect(() => {
    throw new Error('Hey, this failed');
  }, []);
  return null;
};

storiesOf('ErrorBoundary', module).add('standard', () => {
  return (
    <Provider>
      <ErrorBoundary>
        <ThrowComponent />
      </ErrorBoundary>
    </Provider>
  );
});
