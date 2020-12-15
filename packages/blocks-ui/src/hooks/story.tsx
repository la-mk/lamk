import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Provider } from '../basic/Provider';
import { Card } from '../basic/Card';
import hooks from './index';

const BreakpointHookComponent = () => {
  const breakpoint = hooks.useBreakpoint(['1', '2', '3']);
  return (
    <Card>
      {breakpoint}, {window.innerWidth}
    </Card>
  );
};

storiesOf('Hooks', module).add('useBreakpoint', () => {
  return (
    <Provider>
      <BreakpointHookComponent />
    </Provider>
  );
});
