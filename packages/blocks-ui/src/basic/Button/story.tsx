import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Button } from './';
import { Provider } from '../../';

storiesOf('Button', module).add('standard', () => (
  <Provider>
    <div>
      <Button size="sm">Button</Button>
    </div>
  </Provider>
));
