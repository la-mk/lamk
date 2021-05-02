import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Popover } from './';
import { Provider } from '../../';
import { Button } from '../Button';

storiesOf('Popover', module).add('standard', () => (
  <Provider>
    <div>
      <Popover trigger={<Button>Open</Button>}>
        This is the popover content
      </Popover>
    </div>
  </Provider>
));
