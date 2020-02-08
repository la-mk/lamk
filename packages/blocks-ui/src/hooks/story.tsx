import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Provider } from '../basic/Provider';
import { Card } from '../basic/Card';
import hooks from './index';

const BreakpointHookComponent = () => {
  const breakpoint = hooks.useBreakpoint(['1', '2', '3']);
  return <Card>{breakpoint}</Card>;
}

storiesOf('Hooks', module).add('useBreakpoint', () => {
  return (
    <Provider>
      <hooks.BreakpointProvider breakpoints={[350, 700, 1200]}>
        <BreakpointHookComponent />
      </hooks.BreakpointProvider>
    </Provider>
  );
});
