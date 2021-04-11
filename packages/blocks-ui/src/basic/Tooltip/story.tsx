import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Tooltip } from './';
import { Provider } from '../../';

storiesOf('Tooltip', module).add('standard', () => (
  <Provider>
    <div>
      <Tooltip label="The label shows something">
        <div>I am Tooltip</div>
      </Tooltip>
    </div>
  </Provider>
));
