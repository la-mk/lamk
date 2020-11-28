import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Checkbox } from './';
import { Provider } from '../../';

storiesOf('Checkbox', module).add('standard', () => (
  <Provider>
    <div>
      <Checkbox size="sm">I'm a checkbox</Checkbox>
      <Checkbox ml={3}>Check me</Checkbox>
    </div>
  </Provider>
));
