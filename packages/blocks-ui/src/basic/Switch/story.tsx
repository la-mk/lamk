import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Switch } from './';
import { Provider } from '../../';

storiesOf('Switch', module).add('standard', () => (
  <Provider>
    <div>
      <Switch size="sm">I'm a Switch</Switch>
      <Switch>Check me</Switch>
    </div>
  </Provider>
));
