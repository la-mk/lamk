import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Button } from './';
import { Provider } from '../../';

storiesOf('Button', module).add('standard', () => (
  <Provider>
    <div>
      <Button size="sm">Button</Button>
      <Button mx={2} isDanger>
        Danger button
      </Button>
    </div>
  </Provider>
));
